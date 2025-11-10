import InternalDocsLayout from "./InternalDocsLayout";

export default function Space4CorpBlueprints() {
  return (
    <InternalDocsLayout
      title="The Corp Product Blueprints"
      description="The Factory - Our Commercial Products"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            The Corp develops commercial products that generate revenue. Each
            product has a detailed blueprint: PRD, technical architecture, and
            launch roadmap.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Portfolio Overview
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">
                🚀 QuantumLeap Analytics
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Status:</strong> In development
                </p>
                <p>
                  <strong>Purpose:</strong> AI-powered analytics platform for
                  enterprises
                </p>
                <p>
                  <strong>Docs:</strong> PRD, Architecture, Roadmap (see product
                  channel)
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">
                👥 dev-link.me
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Status:</strong> Live
                </p>
                <p>
                  <strong>Purpose:</strong> Professional network for Roblox
                  developers
                </p>
                <p>
                  <strong>Rules:</strong> FERPA/COPPA compliance, educational
                  focus
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">
                🎮 aethex.sbs
              </h4>
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <strong>Status:</strong> Planning (6-month roadmap)
                </p>
                <p>
                  <strong>Purpose:</strong> Game studio collaboration platform
                </p>
                <p>
                  <strong>Target:</strong> Indies & mid-size studios
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Blueprint Template
          </h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <p className="text-sm text-slate-300">
              Each product blueprint includes:
            </p>
            <ul className="text-sm text-slate-300 space-y-1 pl-4">
              <li>
                <strong>PRD:</strong> Business case, target market, features,
                timeline
              </li>
              <li>
                <strong>Architecture:</strong> Technical design, integrations,
                infrastructure
              </li>
              <li>
                <strong>Roadmap:</strong> MVP timeline, feature releases, Q#
                goals
              </li>
              <li>
                <strong>Go-to-Market:</strong> Launch strategy, pricing, sales
                approach
              </li>
              <li>
                <strong>Metrics:</strong> Success KPIs, user growth targets,
                revenue goals
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Product Governance
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Product Manager Role
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>�� Owns product strategy & roadmap</li>
                <li>• Sets priorities & defines scope</li>
                <li>• Reports to VP of Product</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Product Review Cadence
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Weekly: Team standup (engineering)</li>
                <li>• Bi-weekly: Product review (PM + leadership)</li>
                <li>• Monthly: Stakeholder review (board-level)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Feature Prioritization
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Impact on revenue or growth</li>
                <li>• Customer feedback & requests</li>
                <li>• Technical debt & maintenance</li>
                <li>• Strategic alignment</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Access blueprints:</strong> See #products channel in Discord
            or contact Product Manager.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
