import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, ExternalLink, CheckCircle2 } from "lucide-react";

export default function DocsEditorsGuide() {
  return (
    <div className="space-y-8">
      <section>
        <Badge className="bg-indigo-600/20 text-indigo-200 uppercase tracking-wide">
          Docs Editing
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Editing Public Docs (Builder → GitHub PR workflow)
        </h2>
        <p className="text-gray-300 max-w-3xl">
          This guide explains how staff can edit public documentation using
          Builder CMS and publish changes through a GitHub pull request.
          Internal operational docs must remain under{" "}
          <code>/internal-docs</code> and are not editable from the public docs
          workflow.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Edit in Builder</CardTitle>
            <CardDescription className="text-gray-300">
              Use the Builder (MCP) editor for content changes, layout tweaks,
              and page composition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-300">
              <li>
                Open the app and click <strong>Open MCP popover</strong> (
                <a
                  href="#open-mcp-popover"
                  className="text-aethex-400 underline"
                >
                  #open-mcp-popover
                </a>
                ).
              </li>
              <li>
                Select <strong>Builder.io</strong> and edit the desired public
                doc entry (e.g. Getting Started, Platform).
              </li>
              <li>
                Use the preview mode to validate across themes (Brand /
                Professional).
              </li>
              <li>
                Save drafts and request review from the Docs team (assign
                reviewer in Builder).
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Export & Publish (GitHub PR)
            </CardTitle>
            <CardDescription className="text-gray-300">
              After Builder review, export or commit changes to the docs repo
              and open a GitHub PR.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-300">
              <li>
                From Builder, use the export feature to get Markdown/JSX
                content, or copy the updated component code.
              </li>
              <li>
                Create a branch in the repository named{" "}
                <code>docs/{`your-change`}</code> and add the changes under{" "}
                <code>code/client/pages/docs</code> or <code>code/docs</code>.
              </li>
              <li>
                Open a GitHub Pull Request describing the change, link the
                Builder draft, and assign the Docs reviewer team.
              </li>
              <li>
                CI will run lint & build checks. After approval, merge to main
                and the docs will be deployed automatically.
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Public docs policy & safety checks
            </CardTitle>
            <CardDescription className="text-gray-300">
              Ensure no internal APIs or sensitive operational details are
              exposed publicly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-sm text-gray-300">
              <li>
                Do not include internal admin endpoints, service role keys, or
                SQL migrations in public docs.
              </li>
              <li>
                When in doubt, link to an internal doc (under{" "}
                <code>/internal-docs</code>) instead of copying operational
                procedures to public docs.
              </li>
              <li>
                For partner-facing API documentation, create a gated partner
                docs area (contact the Docs lead).
              </li>
              <li>
                Security checklist: remove any{" "}
                <code>/api/discord/role-mappings</code>, admin-register
                endpoints, or internal-only debug examples before publishing.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-sm text-gray-300">
              <li>Builder draft created and reviewed.</li>
              <li>
                GitHub PR open with Builder draft link and reviewer assigned.
              </li>
              <li>CI passes (lint, build).</li>
              <li>Final review & merge by Docs lead.</li>
            </ul>
            <div className="mt-4">
              <Button asChild>
                <a
                  href="https://github.com/AeThex-Corporation/aethex-forge"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <GitBranch className="h-4 w-4" /> Open repo
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
