import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateRequest, requireAuth } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authenticateRequest(req);
  if (!requireAuth(auth, res)) return;

  const { userClient, user } = auth;

  const { data: talentProfile } = await userClient
    .from('nexus_talent_profiles')
    .select('id, az_eligible')
    .eq('user_id', user.id)
    .single();

  if (!talentProfile) {
    return res.status(400).json({ error: 'Talent profile not found. Create one first.' });
  }

  if (req.method === 'GET') {
    const { contract_id, start_date, end_date, status } = req.query;
    
    let query = userClient
      .from('nexus_time_logs')
      .select('*')
      .eq('talent_profile_id', talentProfile.id)
      .order('log_date', { ascending: false });

    if (contract_id) query = query.eq('contract_id', contract_id);
    if (start_date) query = query.gte('log_date', start_date);
    if (end_date) query = query.lte('log_date', end_date);
    if (status) query = query.eq('submission_status', status);

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const body = req.body;
    
    const azEligibleHours = body.location_state === 'AZ' && talentProfile.az_eligible
      ? body.hours_worked
      : 0;

    const { data, error } = await userClient
      .from('nexus_time_logs')
      .insert({
        talent_profile_id: talentProfile.id,
        contract_id: body.contract_id,
        milestone_id: body.milestone_id,
        log_date: body.log_date,
        start_time: body.start_time,
        end_time: body.end_time,
        hours_worked: body.hours_worked,
        description: body.description,
        task_category: body.task_category,
        location_type: body.location_type || 'remote',
        location_state: body.location_state,
        location_city: body.location_city,
        location_latitude: body.location_latitude,
        location_longitude: body.location_longitude,
        az_eligible_hours: azEligibleHours,
        billable: body.billable !== false,
        submission_status: 'draft'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const body = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Time log ID required' });
    }

    const { data: existingLog } = await userClient
      .from('nexus_time_logs')
      .select('*')
      .eq('id', id)
      .eq('talent_profile_id', talentProfile.id)
      .single();

    if (!existingLog) {
      return res.status(404).json({ error: 'Time log not found' });
    }

    if (existingLog.submission_status !== 'draft' && existingLog.submission_status !== 'rejected') {
      return res.status(400).json({ error: 'Can only edit draft or rejected time logs' });
    }

    const azEligibleHours = (body.location_state || existingLog.location_state) === 'AZ' && talentProfile.az_eligible
      ? (body.hours_worked || existingLog.hours_worked)
      : 0;

    const { data, error } = await userClient
      .from('nexus_time_logs')
      .update({
        ...body,
        az_eligible_hours: azEligibleHours,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Time log ID required' });
    }

    const { data: existingLog } = await userClient
      .from('nexus_time_logs')
      .select('submission_status')
      .eq('id', id)
      .eq('talent_profile_id', talentProfile.id)
      .single();

    if (!existingLog) {
      return res.status(404).json({ error: 'Time log not found' });
    }

    if (existingLog.submission_status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete draft time logs' });
    }

    const { error } = await userClient
      .from('nexus_time_logs')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
