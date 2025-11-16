export interface Application {
  id: string;
  creator_id: string;
  opportunity_id: string;
  status: "submitted" | "reviewing" | "accepted" | "rejected" | "withdrawn";
  cover_letter: string;
  response_message?: string;
  applied_at: string;
  updated_at: string;
  aethex_opportunities?: {
    id: string;
    title: string;
    arm_affiliation: string;
    job_type: string;
    posted_by_id: string;
    aethex_creators: {
      username: string;
      avatar_url: string;
    };
  };
}

export interface ApplicationsResponse {
  data: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApplicationWithCreator {
  id: string;
  creator_id: string;
  status: string;
  cover_letter: string;
  applied_at: string;
  aethex_creators: {
    username: string;
    avatar_url: string;
    bio: string;
    skills: string[];
  };
}

const getApiBase = () =>
  typeof window !== "undefined" ? window.location.origin : "";

export async function getMyApplications(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApplicationsResponse> {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const response = await fetch(`${API_BASE}/api/applications/me?${params}`);
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
}

export async function getApplicationsForOpportunity(opportunityId: string) {
  const response = await fetch(
    `${API_BASE}/api/opportunities/${opportunityId}/applications`,
  );
  if (!response.ok) throw new Error("Failed to fetch applications");
  const data = await response.json();
  return data.data as ApplicationWithCreator[];
}

export async function submitApplication(data: {
  opportunity_id: string;
  cover_letter: string;
}): Promise<Application> {
  const response = await fetch(`${API_BASE}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit application");
  return response.json();
}

export async function updateApplicationStatus(
  applicationId: string,
  data: {
    status: "reviewing" | "accepted" | "rejected";
    response_message?: string;
  },
): Promise<Application> {
  const response = await fetch(
    `${API_BASE}/api/applications/${applicationId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) throw new Error("Failed to update application");
  return response.json();
}

export async function withdrawApplication(
  applicationId: string,
): Promise<void> {
  const apiBase = getApiBase();
  if (!apiBase) throw new Error("No API base available");
  const response = await fetch(`${apiBase}/api/applications/${applicationId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to withdraw application");
}
