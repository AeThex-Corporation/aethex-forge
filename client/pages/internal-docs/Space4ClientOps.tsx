import InternalDocsLayout from "./InternalDocsLayout";

export default function Space4ClientOps() {
  return (
    <InternalDocsLayout
      title="Client & Sales Operations"
      description="SOP-001 & SOP-002"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            The Corp's consulting division serves enterprise clients. We also
            hire contractors from the Foundation's talent pool, creating a
            unique pipeline.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Client Onboarding SOP
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Every new client goes through a structured onboarding process:
            </p>

            <div className="space-y-3">
              {[
                {
                  num: "1",
                  title: "Kickoff",
                  desc: "Meet team, set goals, define scope",
                },
                {
                  num: "2",
                  title: "Discovery",
                  desc: "Understand problem, current state, constraints",
                },
                {
                  num: "3",
                  title: "Planning",
                  desc: "Create project plan, timeline, deliverables",
                },
                {
                  num: "4",
                  title: "Team Assignment",
                  desc: "Assign PM, engineers, set communication cadence",
                },
                {
                  num: "5",
                  title: "Execution",
                  desc: "Weekly meetings, status reports, feedback",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex gap-4 p-4 bg-slate-800/30 border border-slate-700 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">
                      {step.title}
                    </p>
                    <p className="text-sm text-slate-300">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Creator-to-Project Pipeline
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              This is unique to AeThex: we hire talented contractors from the
              Foundation's community directly into Corp projects.
            </p>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">How It Works</h4>
              <ol className="text-sm text-slate-300 space-y-2 pl-4 list-decimal">
                <li>Corp Project needs specialized talent</li>
                <li>Check Nexus (Foundation talent marketplace)</li>
                <li>Find matched contractor with right skills</li>
                <li>Make offer via standard contractor agreement</li>
                <li>Contractor executes, gets paid, builds portfolio</li>
              </ol>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Benefits</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>✓ Corp gets vetted, community-proven talent</li>
                <li>✓ Foundation community members get paid work</li>
                <li>✓ Win-win partnership between entities</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Engagement Models
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                T&M (Time & Materials)
              </h4>
              <p className="text-sm text-slate-300 mb-2">
                Client pays for hours spent. Good for exploratory work.
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Hourly rate: $150-300/hr (depends on seniority)</li>
                <li>• Invoiced monthly</li>
                <li>• Scope can evolve</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Fixed Price</h4>
              <p className="text-sm text-slate-300 mb-2">
                Fixed fee for defined scope. Good for clear deliverables.
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Price agreed upfront</li>
                <li>• Scope locked down</li>
                <li>• Payment milestone-based</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Retainer</h4>
              <p className="text-sm text-slate-300 mb-2">
                Monthly fee for ongoing support. Good for long-term clients.
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Monthly fee covers X hours/month</li>
                <li>• Overage billed at hourly rate</li>
                <li>• Flexible scope within retainer hours</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Client Success Metrics
          </h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <p className="text-sm text-slate-300">
              We measure client success by:
            </p>
            <ul className="text-sm text-slate-300 space-y-1 pl-4">
              <li>✓ Project delivered on time & budget</li>
              <li>✓ Client satisfaction (post-project survey)</li>
              <li>✓ Repeat business / expansion</li>
              <li>✓ Referrals to other clients</li>
            </ul>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Questions?</strong> Contact VP of Client Success or your
            Account Manager.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
