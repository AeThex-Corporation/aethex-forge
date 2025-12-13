import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  user_type?: 'admin' | 'creator' | 'client' | 'staff' | 'user';
  primary_arm?: string;
}

export interface AuthResult {
  user: AuthenticatedUser | null;
  error: string | null;
  userClient: any | null;
  adminClient: any | null;
}

export function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    throw new Error("Supabase admin credentials not configured");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getUserClient(accessToken: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase credentials not configured");
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function authenticateRequest(req: VercelRequest): Promise<AuthResult> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { user: null, error: 'Unauthorized - Bearer token required', userClient: null, adminClient: null };
  }
  
  const token = authHeader.split(' ')[1];
  const adminClient = getAdminClient();
  
  const { data: { user }, error: authError } = await adminClient.auth.getUser(token);
  
  if (authError || !user) {
    return { user: null, error: 'Invalid or expired token', userClient: null, adminClient: null };
  }

  const { data: profile } = await adminClient
    .from('user_profiles')
    .select('user_type, primary_arm')
    .eq('id', user.id)
    .single();

  const userClient = getUserClient(token);

  return {
    user: {
      id: user.id,
      email: user.email,
      user_type: profile?.user_type || 'user',
      primary_arm: profile?.primary_arm,
    },
    error: null,
    userClient,
    adminClient,
  };
}

export function requireAuth(result: AuthResult, res: VercelResponse): result is AuthResult & { user: AuthenticatedUser } {
  if (result.error || !result.user) {
    res.status(401).json({ error: result.error || 'Unauthorized' });
    return false;
  }
  return true;
}

export function requireAdmin(result: AuthResult, res: VercelResponse): boolean {
  if (!requireAuth(result, res)) return false;
  if (result.user!.user_type !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }
  return true;
}

export function requireRole(result: AuthResult, roles: string[], res: VercelResponse): boolean {
  if (!requireAuth(result, res)) return false;
  if (!roles.includes(result.user!.user_type || 'user')) {
    res.status(403).json({ error: `Requires role: ${roles.join(' or ')}` });
    return false;
  }
  return true;
}

export async function logComplianceEvent(
  adminClient: any,
  event: {
    entity_type: string;
    entity_id: string;
    event_type: string;
    event_category: 'compliance' | 'financial' | 'access' | 'data_change' | 'tax_reporting' | 'legal';
    actor_id?: string;
    actor_role?: string;
    realm_context?: string;
    description?: string;
    payload?: Record<string, unknown>;
    sensitive_data_accessed?: boolean;
    financial_amount?: number;
    legal_entity?: string;
    cross_entity_access?: boolean;
  },
  req?: VercelRequest
) {
  return adminClient.from('nexus_compliance_events').insert({
    ...event,
    ip_address: req?.headers['x-forwarded-for']?.toString() || req?.socket?.remoteAddress,
    user_agent: req?.headers['user-agent'],
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(501).json({ error: "Not a handler" });
}
