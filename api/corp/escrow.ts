import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getAdminClient();
  
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'GET') {
    const { contract_id } = req.query;
    
    let query = supabase
      .from('nexus_escrow_ledger')
      .select('*')
      .or(`client_id.eq.${user.id},creator_id.eq.${user.id}`);

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
    const { contract_id, amount } = req.body;

    if (!contract_id || !amount) {
      return res.status(400).json({ error: 'contract_id and amount required' });
    }

    const { data: contract } = await supabase
      .from('nexus_contracts')
      .select('id, client_id, creator_id, status')
      .eq('id', contract_id)
      .single();

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.client_id !== user.id) {
      return res.status(403).json({ error: 'Only the client can fund escrow' });
    }

    const { data: existing } = await supabase
      .from('nexus_escrow_ledger')
      .select('id, escrow_balance, funds_deposited')
      .eq('contract_id', contract_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
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

    const { data, error } = await supabase
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

    await supabase.from('nexus_compliance_events').insert({
      entity_type: 'escrow',
      entity_id: data.id,
      event_type: 'escrow_funded',
      event_category: 'financial',
      actor_id: user.id,
      actor_role: 'client',
      realm_context: 'corp',
      description: `Escrow funded with $${amount}`,
      payload: { contract_id, amount },
      financial_amount: amount,
      legal_entity: 'for_profit'
    });

    return res.status(201).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
