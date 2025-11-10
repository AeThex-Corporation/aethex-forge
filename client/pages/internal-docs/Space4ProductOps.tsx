import InternalDocsLayout from "./InternalDocsLayout";

export default function Space4ProductOps() {
  return (
    <InternalDocsLayout
      title="Product & Engineering Operations"
      description="SOP-100 through SOP-102"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            The Corp's engineering team follows a disciplined product
            development lifecycle. This ensures quality, reliability, and
            continuous delivery.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Product Development Lifecycle
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              All Corp products follow this 5-stage lifecycle:
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "1. Discovery",
                  desc: "Define problem, validate market need, create PRD",
                },
                {
                  title: "2. Design",
                  desc: "UX/UI design, architecture, technical specs",
                },
                {
                  title: "3. Development",
                  desc: "Build MVP, 2-week sprints, daily standups",
                },
                {
                  title: "4. Testing & QA",
                  desc: "Quality assurance, user testing, bug fixes",
                },
                {
                  title: "5. Launch & Monitor",
                  desc: "Ship to production, monitor metrics, iterate",
                },
              ].map((stage) => (
                <div
                  key={stage.title}
                  className="bg-slate-800/30 border border-slate-700 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-white mb-1">
                    {stage.title}
                  </h4>
                  <p className="text-sm text-slate-300">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Sprint Methodology
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Sprint Duration</h4>
              <p className="text-sm text-slate-300">
                <strong>2 weeks (10 working days)</strong> - Starting Monday,
                ending Friday
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Sprint Ceremonies
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  <strong>Sprint Planning (Mon):</strong> Agree on sprint goal &
                  tasks
                </li>
                <li>
                  <strong>Daily Standup:</strong> 15-min async or sync update
                </li>
                <li>
                  <strong>Sprint Review (Fri):</strong> Demo completed work
                </li>
                <li>
                  <strong>Retrospective (Fri):</strong> Improve process
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Definition of Done
              </h4>
              <p className="text-sm text-slate-300 mb-2">
                Work is "done" only when:
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>✓ Code written and peer-reviewed</li>
                <li>✓ Unit tests pass (90%+ coverage)</li>
                <li>✓ Integration tests pass</li>
                <li>✓ QA testing complete</li>
                <li>✓ Documentation updated</li>
                <li>✓ Deployed to staging</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Code Review & Merging
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">PR Process</h4>
              <ol className="text-sm text-slate-300 space-y-2 pl-4 list-decimal">
                <li>Push feature branch to GitHub</li>
                <li>Create PR with clear description</li>
                <li>Minimum 2 code reviews</li>
                <li>CI/CD checks must pass (tests, lint)</li>
                <li>Merge to main only if approved</li>
              </ol>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Review Standards
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>✓ Code is readable and well-commented</li>
                <li>✓ No security vulnerabilities</li>
                <li>✓ Tests are included and passing</li>
                <li>✓ Performance implications considered</li>
                <li>✓ Follows team style guide</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Deployment</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Main branch auto-deploys to staging environment</li>
                <li>• Release branch (vX.Y.Z) deploys to production</li>
                <li>• Hotfixes go direct to main + release</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Quality Standards
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Performance</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Page load: &lt;3s</li>
                <li>• API response: &lt;500ms</li>
                <li>• 99.9% uptime SLA</li>
                <li>• Mobile first</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Security</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• No hardcoded secrets</li>
                <li>• HTTPS everywhere</li>
                <li>• SQL injection prevention</li>
                <li>• OWASP Top 10 compliance</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Goal:</strong> Ship quality software predictably and
            sustainably.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
