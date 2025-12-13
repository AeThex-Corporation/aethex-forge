import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authenticateRequest, requireAuth, logComplianceEvent } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateRequest(req);
  if (!requireAuth(auth, res)) return;

  const { userClient, adminClient, user } = auth;

  const { category, skills, experience, limit = 20, offset = 0 } = req.query;

  const { data, error } = await userClient
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

  await logComplianceEvent(adminClient, {
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
  }, req);

  return res.status(200).json({ 
    data: filteredData,
    meta: {
      total: filteredData.length,
      limit: Number(limit),
      offset: Number(offset)
    }
  });
}
