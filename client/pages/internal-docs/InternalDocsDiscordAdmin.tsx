import InternalDocsLayout from "./InternalDocsLayout";
import { Link } from "react-router-dom";

export default function InternalDocsDiscordAdmin() {
  return (
    <InternalDocsLayout
      title="Discord Admin & Operations"
      description="Internal operations for Discord integration"
    >
      <div className="space-y-6">
        <p className="text-slate-300">
          This internal page aggregates operational references for Discord
          integrations, bot operations, and admin tasks. These resources are for
          staff only.
        </p>

        <section>
          <h3 className="text-xl font-semibold text-white">Operational docs</h3>
          <ul className="list-disc pl-6 text-slate-300 space-y-2">
            <li>
              <Link
                to="/internal-docs/onboarding"
                className="text-aethex-400 underline"
              >
                Onboarding handbook
              </Link>{" "}
              — includes Discord linking troubleshooting steps.
            </li>
            <li>
              <a
                href="/docs/DISCORD-ADMIN-COMMANDS-REGISTRATION.md"
                className="text-aethex-400 underline"
              >
                Discord Admin Commands Registration
              </a>{" "}
              — admin endpoint usage and token guidelines.
            </li>
            <li>
              <a
                href="/docs/DISCORD-LINKING-FLOW-ANALYSIS.md"
                className="text-aethex-400 underline"
              >
                Discord Linking Flow Analysis
              </a>{" "}
              — detailed flow and fixes.
            </li>
            <li>
              <a
                href="/docs/DISCORD-ACTIVITY-DEPLOYMENT.md"
                className="text-aethex-400 underline"
              >
                Discord Activity Deployment
              </a>{" "}
              — deploy & register commands (internal).
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white">Quick links</h3>
          <ul className="list-disc pl-6 text-slate-300 space-y-2">
            <li>
              <Link to="/admin" className="text-aethex-400 underline">
                Admin panel
              </Link>
            </li>
            <li>
              <Link to="/staff/docs" className="text-aethex-400 underline">
                Staff docs index
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/AeThex-Corporation/aethex-forge"
                target="_blank"
                rel="noreferrer"
                className="text-aethex-400 underline"
              >
                Source repo
              </a>
            </li>
          </ul>
        </section>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
          <strong>Reminder:</strong> Do not copy operational steps to public
          docs. Use the Builder → PR process for any partner-facing content and
          consult Security before publishing sensitive integration details.
        </div>
      </div>
    </InternalDocsLayout>
  );
}
