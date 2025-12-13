import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient, getUserClient } from "../_auth";

const STUDIO_API_KEY = process.env.STUDIO_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (id) {
    const { data, error } = await supabase
      .from('nexus_contracts')
      .select(`
        id, title, status, contract_type,
        start_date, end_date,
        creator_id, client_id
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
    }

    if (!isServiceAuth && data.creator_id !== userId && data.client_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.status(200).json({ 
      data: {
        id: data.id,
        title: data.title,
        status: data.status,
        contract_type: data.contract_type,
        start_date: data.start_date,
        end_date: data.end_date,
        is_creator: data.creator_id === userId,
        is_client: data.client_id === userId
      }
    });
  }

  if (!userId && !isServiceAuth) {
    return res.status(400).json({ error: 'user_id required for listing contracts' });
  }

  const { data, error } = await supabase
    .from('nexus_contracts')
    .select(`
      id, title, status, contract_type,
      start_date, end_date
    `)
    .or(`creator_id.eq.${userId},client_id.eq.${userId}`)
    .in('status', ['active', 'pending'])
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
