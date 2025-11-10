import InternalDocsLayout from "./InternalDocsLayout";

export default function Space3FoundationGovernance() {
  return (
    <InternalDocsLayout
      title="Foundation Governance Model & DAO Charter"
      description="How The Foundation Operates as a Non-Profit"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            The AeThex Foundation is a 501(c)(3) non-profit organization. Its
            governance model balances accountability to stakeholders, fiscal
            responsibility, and mission-driven decision-making.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Organizational Structure
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Board of Directors
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  <strong>Size:</strong> 5-9 members (odd number for voting)
                </li>
                <li>
                  <strong>Term:</strong> 2 years, staggered (2-3 rotate
                  annually)
                </li>
                <li>
                  <strong>Role:</strong> Set strategy, approve budget, oversee
                  compliance
                </li>
                <li>
                  <strong>Independence:</strong> Majority must be independent
                  (not employees of related entities)
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Executive Director
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  <strong>Role:</strong> Day-to-day operations, program
                  management
                </li>
                <li>
                  <strong>Reports To:</strong> Board of Directors
                </li>
                <li>
                  <strong>Accountability:</strong> Annual performance review by
                  Board
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Committees</h4>
              <div className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  <strong>• Finance Committee:</strong> Budget, audit,
                  investments
                </li>
                <li>
                  <strong>• Program Committee:</strong> Mission delivery,
                  outcomes
                </li>
                <li>
                  <strong>• Governance Committee:</strong> Policies, compliance,
                  Board nominating
                </li>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Decision Making
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Board Meetings</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Quarterly (minimum) or as needed</li>
                <li>• In-person or video (all present)</li>
                <li>• Minutes taken and filed</li>
                <li>• Majority quorum required (50% + 1)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Voting Rules</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Major decisions: Simple majority (50% + 1) vote</li>
                <li>
                  • Budget: Requires Board approval & Finance Committee review
                </li>
                <li>• Governance changes: Supermajority (2/3)</li>
                <li>• Program approval: Program Committee then Board</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Conflict of Interest
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Board members must disclose potential conflicts</li>
                <li>
                  • No voting on decisions where you have a personal stake
                </li>
                <li>• Annual COI disclosures required</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Accountability</h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Financial</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Annual independent audit</li>
                <li>• Form 990 filed publicly (IRS)</li>
                <li>• Quarterly financial reports to Board</li>
                <li>• Annual 1099s/W-2s for staff</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Programmatic</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Annual impact report</li>
                <li>• Outcome metrics tracked quarterly</li>
                <li>• Community feedback solicited</li>
                <li>• Program evaluations conducted</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Legal & Compliance
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Maintain 501(c)(3) status</li>
                <li>• Follow state charity regulations</li>
                <li>• Annual governance review</li>
                <li>• Whistleblower policy in place</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Fund Accounting
          </h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <p className="text-sm text-slate-300">
              The Foundation maintains separate funds for accountability:
            </p>
            <div className="text-sm text-slate-300 space-y-2 pl-4">
              <p>
                <strong>Unrestricted Fund:</strong> General operations, can be
                used for any mission-aligned purpose
              </p>
              <p>
                <strong>Restricted Funds:</strong> Donor-restricted (education),
                program-specific grants
              </p>
              <p>
                <strong>Endowment (future):</strong> Long-term sustainability,
                generates annual spending
              </p>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Guiding Principle:</strong> The Foundation's governance
            ensures we serve the public benefit, not private interests.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
