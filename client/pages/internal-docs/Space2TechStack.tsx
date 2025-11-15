import InternalDocsLayout from "./InternalDocsLayout";

export default function Space2TechStack() {
  return (
    <InternalDocsLayout
      title="Ecosystem Tech Stack Overview"
      description="Tools & Technologies We Use"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            This is a high-level overview of the technologies and tools that
            power AeThex. For detailed documentation, see platform-specific
            guides.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Core Platforms</h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-3">
                🌐 aethex.dev (Main Platform)
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS,
                  Vite
                </p>
                <p>
                  <strong>Backend:</strong> Node.js, Express, TypeScript
                </p>
                <p>
                  <strong>Database:</strong> Supabase (PostgreSQL)
                </p>
                <p>
                  <strong>Hosting:</strong> Vercel (Frontend + Serverless API)
                </p>
                <p>
                  <strong>Auth:</strong> Supabase Auth (Email, Google, GitHub,
                  Discord, Roblox, Web3)
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-3">
                📊 Nexus.aethex.dev (Talent Marketplace)
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Frontend:</strong> React, TypeScript
                </p>
                <p>
                  <strong>Database:</strong> Supabase (PostgreSQL) + DevConnect
                  integration
                </p>
                <p>
                  <strong>Purpose:</strong> Creator directory, opportunity
                  board, applications
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-3">
                👥 dev-link.me (Professional Network)
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Status:</strong> External platform for Roblox
                  developers
                </p>
                <p>
                  <strong>Integration:</strong> OAuth linking to aethex.dev
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Backend Services
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                📧 Email Service
              </h4>
              <p className="text-sm text-slate-300 mb-2">
                <strong>Provider:</strong> Hostinger SMTP (support@aethex.tech)
              </p>
              <p className="text-sm text-slate-300">
                Used for: Notifications, password resets, announcements
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                💬 Real-Time Communication
              </h4>
              <p className="text-sm text-slate-300 mb-2">
                <strong>Tool:</strong> Discord (bot + OAuth integration)
              </p>
              <p className="text-sm text-slate-300">
                Used for: Chat, slash commands, role management, activity iframe
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🎮 Game Platform
              </h4>
              <p className="text-sm text-slate-300 mb-2">
                <strong>Integration:</strong> Roblox OAuth + Open Cloud API
              </p>
              <p className="text-sm text-slate-300">
                Used for: User linking, game authentication, account management
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">⛓️ Web3</h4>
              <p className="text-sm text-slate-300 mb-2">
                <strong>Integration:</strong> Ethereum (Metamask) for wallet
                linking
              </p>
              <p className="text-sm text-slate-300">
                Used for: User verification, wallet authentication
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Development Tools
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Version Control</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• GitHub (code repositories)</li>
                <li>• Git flow for branching</li>
                <li>• Pull requests for all changes</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">CI/CD</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• GitHub Actions for automated builds</li>
                <li>• Lint & test on every commit</li>
                <li>• Auto-deploy to staging & production</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Monitoring</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Sentry (error tracking)</li>
                <li>• Vercel Analytics (performance)</li>
                <li>• Supabase Dashboard (database)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Deployment</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Vercel (Frontend + Serverless API)</li>
                <li>• Railway (Discord Bot)</li>
                <li>• GitHub Actions (Automation)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Communication & Collaboration
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Discord</h4>
              <p className="text-sm text-slate-300">
                Team chat, announcements, real-time coordination
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Email</h4>
              <p className="text-sm text-slate-300">
                Formal communication, records, documentation
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Internal Docs Hub (This Site)
              </h4>
              <p className="text-sm text-slate-300">
                Standard operating procedures, policies, organizational docs
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Required Accounts & Access
          </h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-300 mb-4">
              All new team members should have access to:
            </p>
            <ul className="text-sm text-slate-300 space-y-2 pl-4">
              <li>✓ GitHub (code repositories)</li>
              <li>✓ Discord (team communication)</li>
              <li>✓ Email (corporate account)</li>
              <li>✓ Supabase (database access, if needed)</li>
              <li>✓ Vercel (deployment, if needed)</li>
              <li>✓ Railway (Discord bot, if needed)</li>
              <li>✓ Sentry (error tracking, if needed)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Key Principles</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <p className="font-semibold text-white mb-1">Security First</p>
                <p className="text-sm text-slate-400">
                  We prioritize security over convenience. Use strong passwords,
                  MFA, and never share credentials.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <p className="font-semibold text-white mb-1">Open Standards</p>
                <p className="text-sm text-slate-400">
                  We use open-source tools when possible. We contribute back to
                  the community.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <p className="font-semibold text-white mb-1">Performance</p>
                <p className="text-sm text-slate-400">
                  We measure, monitor, and optimize. Fast = better UX = happier
                  users.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">🛠️</div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Developer Experience
                </p>
                <p className="text-sm text-slate-400">
                  We invest in tools, docs, and processes that make developers
                  happy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>For detailed guides:</strong> See platform-specific
            documentation or contact your team lead.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
