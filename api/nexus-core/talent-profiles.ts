import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateRequest, requireAuth, logComplianceEvent } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authenticateRequest(req);
  if (!requireAuth(auth, res)) return;

  const { userClient, adminClient, user } = auth;

  if (req.method === 'GET') {
    const { data, error } = await userClient
      .from('nexus_talent_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const body = req.body;
    
    const { data, error } = await userClient
      .from('nexus_talent_profiles')
      .upsert({
        user_id: user.id,
        legal_first_name: body.legal_first_name,
        legal_last_name: body.legal_last_name,
        tax_classification: body.tax_classification,
        residency_state: body.residency_state,
        residency_country: body.residency_country || 'US',
        address_city: body.address_city,
        address_state: body.address_state,
        address_zip: body.address_zip,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await logComplianceEvent(adminClient, {
      entity_type: 'talent',
      entity_id: data.id,
      event_type: 'profile_updated',
      event_category: 'data_change',
      actor_id: user.id,
      actor_role: 'talent',
      realm_context: 'nexus',
      description: 'Talent profile updated',
      payload: { fields_updated: Object.keys(body) }
    }, req);

    return res.status(200).json({ data });
  }

  if (req.method === 'GET' && req.query.action === 'compliance-summary') {
    const { data, error } = await userClient
      .rpc('get_talent_compliance_summary', { p_user_id: user.id });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
