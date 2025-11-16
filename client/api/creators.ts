export interface Creator {
  id: string;
  username: string;
  bio: string;
  skills: string[];
  avatar_url: string;
  experience_level: string;
  arm_affiliations: string[];
  primary_arm: string;
  spotify_profile_url?: string;
  created_at: string;
  is_discoverable: boolean;
  allow_recommendations: boolean;
  devconnect_linked: boolean;
  aethex_projects?: Project[];
  aethex_skill_endorsements?: SkillEndorsement[];
  devconnect_link?: DevConnectLink;
}

export interface Project {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export interface SkillEndorsement {
  skill: string;
  count: number;
}

export interface DevConnectLink {
  id: string;
  devconnect_username: string;
  devconnect_profile_url: string;
  verified: boolean;
}

export interface CreatorsResponse {
  data: Creator[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const getApiBase = () =>
  typeof window !== "undefined" ? window.location.origin : "";

export async function getCreators(filters?: {
  arm?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CreatorsResponse> {
  const params = new URLSearchParams();
  if (filters?.arm) params.append("arm", filters.arm);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const response = await fetch(`${API_BASE}/api/creators?${params}`);
  if (!response.ok) throw new Error("Failed to fetch creators");
  return response.json();
}

export async function getCreatorByUsername(username: string): Promise<Creator> {
  const response = await fetch(`${API_BASE}/api/creators/${username}`);
  if (!response.ok) throw new Error("Creator not found");
  return response.json();
}

export async function createCreatorProfile(data: {
  username: string;
  bio: string;
  skills: string[];
  avatar_url: string;
  experience_level: string;
  primary_arm: string;
  arm_affiliations: string[];
}): Promise<Creator> {
  const response = await fetch(`${API_BASE}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create creator profile");
  return response.json();
}

export async function updateCreatorProfile(data: {
  username?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  experience_level?: string;
  primary_arm?: string;
  arm_affiliations?: string[];
  is_discoverable?: boolean;
  allow_recommendations?: boolean;
}): Promise<Creator> {
  const response = await fetch(`${API_BASE}/api/creators/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update creator profile");
  return response.json();
}

export async function addProject(data: {
  title: string;
  description: string;
  url: string;
  image_url: string;
  tags: string[];
  is_featured?: boolean;
}): Promise<Project> {
  const response = await fetch(`${API_BASE}/api/creators/me/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to add project");
  return response.json();
}

export async function updateProject(
  projectId: string,
  data: {
    title?: string;
    description?: string;
    url?: string;
    image_url?: string;
    tags?: string[];
    is_featured?: boolean;
  },
): Promise<Project> {
  const response = await fetch(
    `${API_BASE}/api/creators/me/projects/${projectId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function deleteProject(projectId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE}/api/creators/me/projects/${projectId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) throw new Error("Failed to delete project");
}

export async function endorseSkill(
  creatorId: string,
  skill: string,
): Promise<void> {
  const apiBase = getApiBase();
  if (!apiBase) throw new Error("No API base available");
  const response = await fetch(`${apiBase}/api/creators/${creatorId}/endorse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skill }),
  });
  if (!response.ok) throw new Error("Failed to endorse skill");
}
