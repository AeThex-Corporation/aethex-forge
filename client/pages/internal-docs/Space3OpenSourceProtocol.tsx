import InternalDocsLayout from "./InternalDocsLayout";

export default function Space3OpenSourceProtocol() {
  return (
    <InternalDocsLayout
      title="Open-Source Protocol & AI Ethics Initiative"
      description="The Axiom Protocol & PIP Process"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            The AeThex Foundation maintains the Axiom Protocol—an open-source AI
            Ethics framework. This protocol is our contribution to the broader
            tech community.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Axiom Protocol Overview
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Purpose</h4>
              <p className="text-sm text-slate-300">
                The Axiom Protocol is an ethical framework for AI development.
                It's built on the principle that technology should be
                transparent, accountable, and human-centered.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Core Principles</h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  <strong>Transparency:</strong> AI systems must be explainable
                </li>
                <li>
                  <strong>Accountability:</strong> Clear ownership of outcomes
                </li>
                <li>
                  <strong>Fairness:</strong> No discriminatory outcomes
                </li>
                <li>
                  <strong>Privacy:</strong> User data is protected
                </li>
                <li>
                  <strong>Safety:</strong> Minimize harms and unintended
                  consequences
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Status</h4>
              <p className="text-sm text-slate-300">
                Open-source on GitHub. Community contributions welcome via PIP
                (Protocol Improvement Proposals).
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            PIP (Protocol Improvement Proposal) Process
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-300 mb-4">
              Want to contribute to the Axiom Protocol? Follow this process:
            </p>

            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Propose Your Idea
                  </p>
                  <p className="text-sm text-slate-300">
                    Open an issue on GitHub with your proposal. Describe the
                    problem and your suggested solution.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Community Discussion
                  </p>
                  <p className="text-sm text-slate-300">
                    Community provides feedback. Minimum 1-week discussion
                    window.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Write Full PIP
                  </p>
                  <p className="text-sm text-slate-300">
                    Author writes detailed PIP document (template provided).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  4
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Maintainer Review
                  </p>
                  <p className="text-sm text-slate-300">
                    Protocol maintainers review PIP for technical merit and
                    alignment with values.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  5
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Community Vote
                  </p>
                  <p className="text-sm text-slate-300">
                    Community votes on PIP (50%+ approval to proceed).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  6
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Implementation
                  </p>
                  <p className="text-sm text-slate-300">
                    Author submits pull request. Code review before merge.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  7
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Release</p>
                  <p className="text-sm text-slate-300">
                    Included in next protocol release. Author credited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Contribution Guidelines
          </h3>
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">✓ We Accept</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Bug fixes and improvements to existing protocols</li>
                <li>• New frameworks aligned with our core principles</li>
                <li>• Documentation improvements</li>
                <li>• Use cases and real-world examples</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-2">
                ✗ We Don't Accept
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Proposals that violate core principles</li>
                <li>• Undocumented changes</li>
                <li>• Proprietary or patent-encumbered code</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Nexus Platform</h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-300 mb-3">
              The Foundation operates Nexus—a talent marketplace built on open
              principles. It connects creators, developers, and organizations.
            </p>
            <ul className="text-sm text-slate-300 space-y-2 pl-4">
              <li>
                <strong>Purpose:</strong> Reduce barriers for talent to find
                opportunities
              </li>
              <li>
                <strong>Open Data:</strong> Creator directory is publicly
                searchable
              </li>
              <li>
                <strong>Fair Terms:</strong> Transparent fees, no hidden charges
              </li>
              <li>
                <strong>Integration:</strong> Works with dev-link.me for
                expanded reach
              </li>
            </ul>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Contributing:</strong> See CONTRIBUTING.md in protocol
            repository on GitHub. All contributors agree to our Code of Conduct.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
