import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient, getUserClient, logComplianceEvent } from "../_auth";

const STUDIO_API_KEY = process.env.STUDIO_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = req.headers['x-studio-api-key'];
  const authHeader = req.headers.authorization;
  
  let userId: string | null = null;
  let isServiceAuth = false;
  let supabase: any;

  if (apiKey === STUDIO_API_KEY && STUDIO_API_KEY) {
    isServiceAuth = true;
    supabase = getAdminClient();
  } else if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const adminClient = getAdminClient();
    const { data: { user }, error } = await adminClient.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    userId = user.id;
    supabase = getUserClient(token);
  } else {
    return res.status(401).json({ error: 'Unauthorized - requires Bearer token or X-Studio-API-Key' });
  }

  const adminClient = getAdminClient();

  if (req.method === 'POST') {
    const body = req.body;
    
    if (!body.user_id && !userId) {
      return res.status(400).json({ error: 'user_id required for service auth' });
    }

    const targetUserId = body.user_id || userId;

    const { data: talentProfile } = await adminClient
      .from('nexus_talent_profiles')
      .select('id, az_eligible')
      .eq('user_id', targetUserId)
      .single();

    if (!talentProfile) {
      return res.status(400).json({ error: 'Talent profile not found for user' });
    }

    const azEligibleHours = body.location_state === 'AZ' && talentProfile.az_eligible
      ? body.hours_worked
      : 0;

    const { data, error } = await adminClient
      .from('nexus_time_logs')
      .insert({
        talent_profile_id: talentProfile.id,
        contract_id: body.contract_id,
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
        location_verified: !!body.location_latitude && !!body.location_longitude,
        az_eligible_hours: azEligibleHours,
        billable: body.billable !== false,
        submission_status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await logComplianceEvent(adminClient, {
      entity_type: 'time_log',
      entity_id: data.id,
      event_type: 'studio_time_log_created',
      event_category: 'compliance',
      actor_id: isServiceAuth ? undefined : userId || undefined,
      actor_role: isServiceAuth ? 'api' : 'talent',
      realm_context: 'studio',
      description: 'Time log submitted via Studio API',
      payload: { 
        source: 'studio_api',
        location_verified: data.location_verified,
        az_eligible_hours: azEligibleHours
      }
    }, req);

    return res.status(201).json({ data });
  }

  if (req.method === 'GET') {
    const { contract_id, start_date, end_date, user_id: queryUserId } = req.query;
    
    const targetUserId = queryUserId || userId;
    
    if (!targetUserId && !isServiceAuth) {
      return res.status(400).json({ error: 'user_id required' });
    }

    let query = supabase
      .from('nexus_time_logs')
      .select(`
        id, log_date, start_time, end_time, hours_worked,
        location_state, az_eligible_hours, submission_status,
        contract_id
      `);

    if (targetUserId) {
      const { data: talentProfile } = await adminClient
        .from('nexus_talent_profiles')
        .select('id')
        .eq('user_id', targetUserId)
        .single();
      
      if (talentProfile) {
        query = query.eq('talent_profile_id', talentProfile.id);
      }
    }

    if (contract_id) query = query.eq('contract_id', contract_id);
    if (start_date) query = query.gte('log_date', start_date);
    if (end_date) query = query.lte('log_date', end_date);

    const { data, error } = await query.order('log_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
