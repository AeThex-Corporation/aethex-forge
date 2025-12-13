import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const { time_log_id, decision, notes } = req.body;

  if (!time_log_id || !decision) {
    return res.status(400).json({ error: 'time_log_id and decision required' });
  }

  if (!['approved', 'rejected', 'needs_correction'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision. Must be: approved, rejected, or needs_correction' });
  }

  const { data: timeLog } = await supabase
    .from('nexus_time_logs')
    .select('*, nexus_contracts!inner(client_id)')
    .eq('id', time_log_id)
    .single();

  if (!timeLog) {
    return res.status(404).json({ error: 'Time log not found' });
  }

  const isClient = timeLog.nexus_contracts?.client_id === user.id;
  const isAdmin = userProfile?.user_type === 'admin';

  if (!isClient && !isAdmin) {
    return res.status(403).json({ error: 'Only the contract client or admin can approve time logs' });
  }

  if (timeLog.submission_status !== 'submitted') {
    return res.status(400).json({ error: 'Time log must be in submitted status to approve/reject' });
  }

  const newStatus = decision === 'approved' ? 'approved' : 
                    decision === 'rejected' ? 'rejected' : 'rejected';

  const { data, error } = await supabase
    .from('nexus_time_logs')
    .update({
      submission_status: newStatus,
      approved_at: decision === 'approved' ? new Date().toISOString() : null,
      approved_by: decision === 'approved' ? user.id : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', time_log_id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  await supabase.from('nexus_time_log_audits').insert({
    time_log_id: time_log_id,
    reviewer_id: user.id,
    audit_type: decision === 'approved' ? 'approval' : 'rejection',
    decision: decision,
    notes: notes,
    ip_address: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
    user_agent: req.headers['user-agent']
  });

  await supabase.from('nexus_compliance_events').insert({
    entity_type: 'time_log',
    entity_id: time_log_id,
    event_type: `time_log_${decision}`,
    event_category: 'compliance',
    actor_id: user.id,
    actor_role: isAdmin ? 'admin' : 'client',
    realm_context: 'nexus',
    description: `Time log ${decision} by ${isAdmin ? 'admin' : 'client'}`,
    payload: { decision, notes }
  });

  return res.status(200).json({ data });
}
