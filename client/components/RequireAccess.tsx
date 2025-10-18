import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequireAccessProps {
  allowedRealms?: Array<"game_developer" | "client" | "community_member" | "customer" | "staff">;
  allowedRoles?: string[];
  children: React.ReactElement;
}

export default function RequireAccess({ allowedRealms, allowedRoles, children }: RequireAccessProps) {
  const { user, profile, roles } = useAuth();
  const location = useLocation();

  const realmOk = !allowedRealms || allowedRealms.includes((profile as any)?.user_type);
  const rolesOk = !allowedRoles || (Array.isArray(roles) && roles.some(r => allowedRoles.includes(r.toLowerCase())));

  if (!user) return <Navigate to={`/onboarding?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (!realmOk || !rolesOk) return <Navigate to="/realms" replace />;

  return children;
}
