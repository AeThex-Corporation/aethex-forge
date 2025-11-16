import InternalDocsLayout from "./InternalDocsLayout";

export default function Space4PlatformStrategy() {
  return (
    <InternalDocsLayout
      title="Platform Strategy"
      description="aethex.dev - The Monolith"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            aethex.dev is the central platform that connects all AeThex entities
            and serves our ecosystem. It's built on modern tech, designed for
            scale, and focused on user experience.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Platform Vision
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">What Is It?</h4>
              <p className="text-sm text-slate-300">
                aethex.dev is the unified entry point for the AeThex ecosystem.
                It's where users sign up, choose their arm, access programs, and
                connect to platform features.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Who Uses It?</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Lab researchers & innovators</li>
                <li>• Game developers (GameForge)</li>
                <li>• Enterprise clients (Corp)</li>
                <li>• Community members (Foundation)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Strategic Goals</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>1. Onboard 1M+ creators by 2026</li>
                <li>2. Enable $50M+ in transaction volume (Nexus)</li>
                <li>3. Build community moat (switching cost)</li>
                <li>4. Diversify revenue (subscriptions, marketplace fees)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Platform Architecture
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Tech Stack</h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Frontend:</strong> React 18 + TypeScript, Tailwind
                  CSS, Vite
                </p>
                <p>
                  <strong>Backend:</strong> Node.js + Express + TypeScript
                </p>
                <p>
                  <strong>Database:</strong> PostgreSQL (Supabase)
                </p>
                <p>
                  <strong>Auth:</strong> Multi-provider OAuth (Email, Google,
                  GitHub, Discord, Roblox, Web3)
                </p>
                <p>
                  <strong>Hosting:</strong> Vercel (frontend & serverless
                  functions)
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Feature Roadmap (Next 12 Months)
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>Q1: Enhanced creator profiles, portfolio showcase</li>
                <li>Q2: Marketplace improvements, payment processing</li>
                <li>Q3: Social features (comments, reactions, networking)</li>
                <li>Q4: Mobile app launch</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Scaling Considerations
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Database: Multi-region replication (read replicas)</li>
                <li>• API: Load balancing, caching (Redis)</li>
                <li>• CDN: Global content distribution (Cloudflare)</li>
                <li>• Search: Full-text search (Elasticsearch)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Key Features by Arm
          </h3>
          <div className="space-y-3">
            {[
              {
                arm: "Labs",
                features:
                  "Research project profiles, publication index, team directories",
              },
              {
                arm: "GameForge",
                features:
                  "Game portfolios, shipping metrics, asset library, templates",
              },
              {
                arm: "Corp",
                features:
                  "Client projects, case studies, billing, contract management",
              },
              {
                arm: "Foundation",
                features:
                  "Program enrollment, mentorship matching, community forum",
              },
            ].map((item) => (
              <div
                key={item.arm}
                className="bg-slate-800/30 border border-slate-700 rounded-lg p-4"
              >
                <h4 className="font-semibold text-white mb-1">{item.arm}</h4>
                <p className="text-sm text-slate-300">{item.features}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">KPIs & Metrics</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">User Metrics</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Monthly Active Users (MAU)</li>
                <li>• Daily Active Users (DAU)</li>
                <li>• User retention (30/90 day)</li>
                <li>• Signup conversion rate</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Business Metrics
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Platform revenue</li>
                <li>• Transaction volume</li>
                <li>• Average order value</li>
                <li>• Customer lifetime value</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Strategy Owner:</strong> VP of Platform. See #platform
            channel for detailed roadmap.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
