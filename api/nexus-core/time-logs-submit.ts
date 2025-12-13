import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateRequest, requireAuth, logComplianceEvent } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateRequest(req);
  if (!requireAuth(auth, res)) return;

  const { userClient, adminClient, user } = auth;

  const { data: talentProfile } = await userClient
    .from('nexus_talent_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!talentProfile) {
    return res.status(400).json({ error: 'Talent profile not found' });
  }

  const { time_log_ids } = req.body;

  if (!time_log_ids || !Array.isArray(time_log_ids) || time_log_ids.length === 0) {
    return res.status(400).json({ error: 'time_log_ids array required' });
  }

  const { data: logs, error: fetchError } = await userClient
    .from('nexus_time_logs')
    .select('id, submission_status')
    .in('id', time_log_ids)
    .eq('talent_profile_id', talentProfile.id);

  if (fetchError) {
    return res.status(500).json({ error: fetchError.message });
  }

  const invalidLogs = logs?.filter(l => l.submission_status !== 'draft' && l.submission_status !== 'rejected');
  if (invalidLogs && invalidLogs.length > 0) {
    return res.status(400).json({ 
      error: 'Some time logs cannot be submitted',
      invalid_ids: invalidLogs.map(l => l.id)
    });
  }

  const validIds = logs?.map(l => l.id) || [];
  if (validIds.length === 0) {
    return res.status(400).json({ error: 'No valid time logs found' });
  }

  const { data, error } = await userClient
    .from('nexus_time_logs')
    .update({
      submission_status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .in('id', validIds)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  for (const log of data || []) {
    await adminClient.from('nexus_time_log_audits').insert({
      time_log_id: log.id,
      reviewer_id: null,
      audit_type: 'review',
      decision: 'submitted',
      notes: 'Time log submitted for review',
      ip_address: req.headers['x-forwarded-for']?.toString() || req.socket?.remoteAddress,
      user_agent: req.headers['user-agent']
    });
  }

  await logComplianceEvent(adminClient, {
    entity_type: 'time_log',
    entity_id: talentProfile.id,
    event_type: 'batch_submitted',
    event_category: 'compliance',
    actor_id: user.id,
    actor_role: 'talent',
    realm_context: 'nexus',
    description: `Submitted ${data?.length} time logs for review`,
    payload: { time_log_ids: validIds }
  }, req);

  return res.status(200).json({ 
    data,
    submitted_count: data?.length || 0
  });
}
