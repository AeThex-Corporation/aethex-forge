import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RequireAccessProps {
  allowedRealms?: Array<
    "game_developer" | "client" | "community_member" | "customer" | "staff"
  >;
  allowedRoles?: string[];
  children: React.ReactElement;
}

export default function RequireAccess({
  allowedRealms,
  allowedRoles,
  children,
}: RequireAccessProps) {
  const { user, profile, roles } = useAuth();

  const realmOk =
    !allowedRealms || allowedRealms.includes((profile as any)?.user_type);
  const rolesOk =
    !allowedRoles ||
    (Array.isArray(roles) &&
      roles.some((r) => allowedRoles.includes(r.toLowerCase())));

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <section className="container mx-auto max-w-3xl px-4">
            <Card className="bg-card/60 border-border/40 backdrop-blur">
              <CardHeader>
                <Badge
                  variant="outline"
                  className="mb-2 border-aethex-400/50 text-aethex-300"
                >
                  Access
                </Badge>
                <CardTitle>Access denied</CardTitle>
                <CardDescription>
                  Sign in required to view this page.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>
        </div>
      </Layout>
    );
  }

  if (!realmOk || !rolesOk) {
    return (
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <section className="container mx-auto max-w-3xl px-4">
            <Card className="bg-card/60 border-border/40 backdrop-blur">
              <CardHeader>
                <Badge
                  variant="outline"
                  className="mb-2 border-aethex-400/50 text-aethex-300"
                >
                  Access
                </Badge>
                <CardTitle>Access denied</CardTitle>
                <CardDescription>
                  You don’t have the required realm or role for this area.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>
        </div>
      </Layout>
    );
  }

  return children;
}
