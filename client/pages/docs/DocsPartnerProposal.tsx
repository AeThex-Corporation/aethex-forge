import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Users, GitBranch } from "lucide-react";

export default function DocsPartnerProposal() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-semibold text-white">
          Partner Docs & Gated Area Proposal
        </h2>
        <p className="text-gray-300 max-w-3xl">
          This document outlines a proposal for a gated partner documentation
          area, intended for partners and external integrators who require more
          detailed API and integration guides than the public docs expose. The
          gated area will be accessible to approved partners after
          authentication and agreement to terms.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Scope</CardTitle>
            <CardDescription className="text-gray-300">
              Content that belongs in the gated partner area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
              <li>
                Partner API endpoints and sample requests that include partner
                keys or elevated scopes.
              </li>
              <li>
                Operational integration instructions (webhooks, role mappings,
                admin endpoints).
              </li>
              <li>
                Deployment scripts, secrets management guidance (redacted for
                public), and verification flows.
              </li>
              <li>
                Commercial and SLA information, onboarding steps for partner
                accounts.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Access & Workflow</CardTitle>
            <CardDescription className="text-gray-300">
              How partners request and receive access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-300">
              <li>Partner signs NDA and registers interest via sales team.</li>
              <li>
                Docs team creates a partner account and assigns a partner role
                in Supabase.
              </li>
              <li>
                Partner gets access to the gated docs area (passwordless SSO or
                invite link).
              </li>
              <li>
                Partner changes and feedback are managed via Support or a
                private Builder space.
              </li>
            </ol>
            <div className="mt-4">
              <Button asChild>
                <Link
                  to="/internal-docs/onboarding"
                  className="inline-flex items-center gap-2"
                >
                  View Internal Onboarding <GitBranch className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Security & Controls</CardTitle>
            <CardDescription className="text-gray-300">
              Minimum controls for gated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
              <li>
                Partner accounts are RBAC-limited and issued short-lived
                credentials for API testing.
              </li>
              <li>
                Audit logs for partner doc accesses are retained and reviewed
                monthly.
              </li>
              <li>
                Automation prevents copying internal operational docs into
                public pages; editors must follow the PR checklist.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Next steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-300">
              <li>
                Implement partner role and gated content routing (Auth +
                middleware).
              </li>
              <li>
                Create Builder space for partner docs drafts and approval
                workflow.
              </li>
              <li>
                Update CI to only publish public docs from{" "}
                <code>code/client/pages/docs</code> and prevent internal docs
                from being included.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
