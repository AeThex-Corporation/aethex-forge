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

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('id', user.id)
    .single();

  if (userProfile?.user_type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'GET') {
    const { status, start_date, end_date, tax_year } = req.query;

    let query = supabase
      .from('nexus_payouts')
      .select(`
        *,
        nexus_talent_profiles!inner(
          user_id,
          legal_first_name,
          legal_last_name,
          tax_classification,
          residency_state
        )
      `)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (tax_year) query = query.eq('tax_year', tax_year);
    if (start_date) query = query.gte('scheduled_date', start_date);
    if (end_date) query = query.lte('scheduled_date', end_date);

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const totalPending = data?.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.net_amount), 0) || 0;
    const totalProcessed = data?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.net_amount), 0) || 0;

    return res.status(200).json({ 
      data,
      summary: {
        total_payouts: data?.length || 0,
        pending_amount: totalPending,
        processed_amount: totalProcessed
      }
    });
  }

  if (req.method === 'POST' && req.query.action === 'process') {
    const { payout_ids } = req.body;

    if (!payout_ids || !Array.isArray(payout_ids)) {
      return res.status(400).json({ error: 'payout_ids array required' });
    }

    const { data: payouts } = await supabase
      .from('nexus_payouts')
      .select('*')
      .in('id', payout_ids)
      .eq('status', 'pending');

    if (!payouts || payouts.length === 0) {
      return res.status(400).json({ error: 'No pending payouts found' });
    }

    const { data, error } = await supabase
      .from('nexus_payouts')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .in('id', payout_ids)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await supabase.from('nexus_compliance_events').insert({
      entity_type: 'payroll',
      entity_id: user.id,
      event_type: 'payroll_batch_processing',
      event_category: 'financial',
      actor_id: user.id,
      actor_role: 'admin',
      realm_context: 'corp',
      description: `Processing ${data?.length} payouts`,
      payload: { payout_ids, total_amount: data?.reduce((sum, p) => sum + Number(p.net_amount), 0) },
      legal_entity: 'for_profit'
    });

    return res.status(200).json({ 
      data,
      processed_count: data?.length || 0
    });
  }

  if (req.method === 'GET' && req.query.action === 'summary') {
    const currentYear = new Date().getFullYear();

    const { data: yearPayouts } = await supabase
      .from('nexus_payouts')
      .select('net_amount, status, tax_year')
      .eq('tax_year', currentYear);

    const { data: azHours } = await supabase
      .from('nexus_time_logs')
      .select('az_eligible_hours')
      .eq('submission_status', 'approved')
      .gte('log_date', `${currentYear}-01-01`);

    return res.status(200).json({
      tax_year: currentYear,
      total_payouts: yearPayouts?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.net_amount), 0) || 0,
      pending_payouts: yearPayouts?.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.net_amount), 0) || 0,
      total_az_hours: azHours?.reduce((sum, h) => sum + Number(h.az_eligible_hours), 0) || 0,
      payout_count: yearPayouts?.length || 0
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
