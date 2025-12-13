import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateRequest, requireAuth, requireRole, logComplianceEvent } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authenticateRequest(req);
  if (!requireAuth(auth, res)) return;

  const { userClient, adminClient, user } = auth;

  if (req.method === 'GET') {
    // GET: Only clients and admins can view escrow records
    if (!requireRole(auth, ['client', 'admin'], res)) return;
    
    const { contract_id } = req.query;
    
    // Clients can only see escrow records where they are the client
    // Admins can see all escrow records
    let query = user.user_type === 'admin' 
      ? adminClient.from('nexus_escrow_ledger').select('*')
      : userClient.from('nexus_escrow_ledger').select('*').eq('client_id', user.id);

    if (contract_id) {
      query = query.eq('contract_id', contract_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    // POST (funding escrow): Only clients and admins can fund
    if (!requireRole(auth, ['client', 'admin'], res)) return;
    
    const { contract_id, amount } = req.body;

    if (!contract_id || !amount) {
      return res.status(400).json({ error: 'contract_id and amount required' });
    }

    const { data: contract } = await userClient
      .from('nexus_contracts')
      .select('id, client_id, creator_id, status')
      .eq('id', contract_id)
      .single();

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Even admins must be the contract client to fund (or we could allow admin override)
    if (contract.client_id !== user.id && user.user_type !== 'admin') {
      return res.status(403).json({ error: 'Only the client or admin can fund escrow' });
    }

    const { data: existing } = await userClient
      .from('nexus_escrow_ledger')
      .select('id, escrow_balance, funds_deposited')
      .eq('contract_id', contract_id)
      .single();

    if (existing) {
      const { data, error } = await userClient
        .from('nexus_escrow_ledger')
        .update({
          escrow_balance: existing.escrow_balance + amount,
          funds_deposited: existing.funds_deposited + amount,
          status: 'funded',
          funded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ data });
    }

    const { data, error } = await userClient
      .from('nexus_escrow_ledger')
      .insert({
        contract_id: contract_id,
        client_id: contract.client_id,
        creator_id: contract.creator_id,
        escrow_balance: amount,
        funds_deposited: amount,
        status: 'funded',
        funded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await logComplianceEvent(adminClient, {
      entity_type: 'escrow',
      entity_id: data.id,
      event_type: 'escrow_funded',
      event_category: 'financial',
      actor_id: user.id,
      actor_role: user.user_type === 'admin' ? 'admin' : 'client',
      realm_context: 'corp',
      description: `Escrow funded with $${amount}`,
      payload: { contract_id, amount },
      financial_amount: amount,
      legal_entity: 'for_profit'
    }, req);

    return res.status(201).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
