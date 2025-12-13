import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
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

  const { category, skills, experience, limit = 20, offset = 0 } = req.query;

  const { data, error } = await supabase
    .from('foundation_gig_radar')
    .select('*')
    .order('published_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  let filteredData = data || [];
  
  if (category) {
    filteredData = filteredData.filter(d => d.category === category);
  }
  
  if (skills) {
    const skillsArray = (skills as string).split(',');
    filteredData = filteredData.filter(d => 
      d.required_skills.some((s: string) => skillsArray.includes(s))
    );
  }
  
  if (experience) {
    filteredData = filteredData.filter(d => d.required_experience === experience);
  }

  await supabase.from('nexus_compliance_events').insert({
    entity_type: 'gig_radar',
    entity_id: user.id,
    event_type: 'gig_radar_accessed',
    event_category: 'access',
    actor_id: user.id,
    actor_role: 'user',
    realm_context: 'foundation',
    description: 'Foundation user accessed Gig Radar',
    payload: { 
      filters: { category, skills, experience },
      results_count: filteredData.length
    },
    sensitive_data_accessed: false,
    cross_entity_access: true,
    legal_entity: 'non_profit'
  });

  return res.status(200).json({ 
    data: filteredData,
    meta: {
      total: filteredData.length,
      limit: Number(limit),
      offset: Number(offset)
    }
  });
}
