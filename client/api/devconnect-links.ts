export interface DevConnectLink {
  id: string;
  aethex_creator_id: string;
  devconnect_username: string;
  devconnect_profile_url: string;
  verified: boolean;
  linked_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function linkDevConnectAccount(data: {
  devconnect_username: string;
  devconnect_profile_url?: string;
}): Promise<DevConnectLink> {
  const response = await fetch(`${API_BASE}/api/devconnect/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to link DevConnect account");
  return response.json();
}

export async function getDevConnectLink(): Promise<DevConnectLink | null> {
  const response = await fetch(`${API_BASE}/api/devconnect/link`);
  if (!response.ok) throw new Error("Failed to fetch DevConnect link");
  const data = await response.json();
  return data.data;
}

export async function unlinkDevConnectAccount(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/devconnect/link`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to unlink DevConnect account");
}

export async function verifyDevConnectLink(
  verificationCode: string,
): Promise<DevConnectLink> {
  const response = await fetch(`${API_BASE}/api/devconnect/link/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verification_code: verificationCode }),
  });
  if (!response.ok) throw new Error("Failed to verify DevConnect link");
  return response.json();
}
