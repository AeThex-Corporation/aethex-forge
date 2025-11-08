export interface OpportunityPoster {
  id: string;
  username: string;
  avatar_url: string;
  bio?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  experience_level: string;
  arm_affiliation: string;
  posted_by_id: string;
  aethex_creators: OpportunityPoster;
  status: string;
  created_at: string;
  updated_at?: string;
  aethex_applications?: { count: number };
}

export interface OpportunitiesResponse {
  data: Opportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateOpportunityData {
  title: string;
  description: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  experience_level?: string;
  arm_affiliation: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function getOpportunities(filters?: {
  arm?: string;
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  sort?: "recent" | "oldest";
  page?: number;
  limit?: number;
}): Promise<OpportunitiesResponse> {
  const params = new URLSearchParams();
  if (filters?.arm) params.append("arm", filters.arm);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.jobType) params.append("jobType", filters.jobType);
  if (filters?.experienceLevel)
    params.append("experienceLevel", filters.experienceLevel);
  if (filters?.sort) params.append("sort", filters.sort);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const response = await fetch(`${API_BASE}/api/opportunities?${params}`);
  if (!response.ok) throw new Error("Failed to fetch opportunities");
  return response.json();
}

export async function getOpportunityById(id: string): Promise<Opportunity> {
  const response = await fetch(`${API_BASE}/api/opportunities/${id}`);
  if (!response.ok) throw new Error("Opportunity not found");
  return response.json();
}

export async function createOpportunity(
  data: CreateOpportunityData,
): Promise<Opportunity> {
  const response = await fetch(`${API_BASE}/api/opportunities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create opportunity");
  return response.json();
}

export async function updateOpportunity(
  id: string,
  data: Partial<CreateOpportunityData>,
): Promise<Opportunity> {
  const response = await fetch(`${API_BASE}/api/opportunities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update opportunity");
  return response.json();
}

export async function closeOpportunity(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/opportunities/${id}/close`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to close opportunity");
}

export async function getApplicationsForOpportunity(opportunityId: string) {
  const response = await fetch(
    `${API_BASE}/api/opportunities/${opportunityId}/applications`,
  );
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
}
