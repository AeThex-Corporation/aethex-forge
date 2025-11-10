import InternalDocsLayout from "./InternalDocsLayout";

export default function Space5Onboarding() {
  return (
    <InternalDocsLayout title="New Hire Onboarding" description="SOP-300">
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            Welcome to AeThex! This guide walks new hires through their first
            days/weeks. It covers setup, culture, and key information you need
            to succeed.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Before Your First Day
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">HR Tasks</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>✓ Signed offer letter & employment agreement</li>
                <li>✓ Tax forms (W-4, I-9)</li>
                <li>✓ Benefits enrollment (if eligible)</li>
                <li>✓ Background check completed</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Tech Setup</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>✓ Laptop & peripherals</li>
                <li>✓ Email account created</li>
                <li>✓ GitHub account linked</li>
                <li>✓ Supabase access granted</li>
                <li>✓ Discord account & channels</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Your First Week
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                1
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Day 1: Welcome</p>
                <p className="text-sm text-slate-300">
                  Meet your manager, team intro, office/remote setup
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                2
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Day 2-3: Onboarding Training
                </p>
                <p className="text-sm text-slate-300">
                  Review Code of Conduct, Communication Protocol, tech stack
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                3
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Day 4-5: First Task
                </p>
                <p className="text-sm text-slate-300">
                  Manager assigns small, achievable first task to get
                  comfortable
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Your First Month
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Week 1-2</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Dev environment setup</li>
                <li>• Review product documentation</li>
                <li>• 1-on-1 meetings with cross-functional leads</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Week 3-4</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Complete first sprint</li>
                <li>• Contribute code (with review)</li>
                <li>• Attend all team meetings</li>
                <li>• 30-day check-in with manager</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Essential Resources
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Documentation</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Internal Docs Hub (you're reading it!)</li>
                <li>• Code of Conduct (KND-004)</li>
                <li>• Communication Protocol (SOP-000)</li>
                <li>• Tech Stack Overview (KND-003)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Digital Tools</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• GitHub - Code repos & documentation</li>
                <li>• Discord - Team chat</li>
                <li>• Email - Formal communication</li>
                <li>• Supabase - Database access</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">People</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Your manager - Ask questions, feedback, guidance</li>
                <li>• HR - Benefits, policies, onboarding</li>
                <li>• Team leads - Technical questions</li>
                <li>• Colleagues - Culture & connection</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            What to Expect from AeThex
          </h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <div>
              <p className="font-semibold text-blue-400 mb-2">✓ Autonomy</p>
              <p className="text-sm text-slate-300">
                We trust you to do good work. Ownership and accountability are
                valued.
              </p>
            </div>

            <div>
              <p className="font-semibold text-blue-400 mb-2">✓ Growth</p>
              <p className="text-sm text-slate-300">
                Investment in your development. Learning budget, mentorship,
                career path.
              </p>
            </div>

            <div>
              <p className="font-semibold text-blue-400 mb-2">✓ Transparency</p>
              <p className="text-sm text-slate-300">
                We share information openly. You'll know what's happening across
                the company.
              </p>
            </div>

            <div>
              <p className="font-semibold text-blue-400 mb-2">✓ Community</p>
              <p className="text-sm text-slate-300">
                You're part of something bigger. We care about each other's
                success.
              </p>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Questions?</strong> Ask your manager or HR. We're here to
            help you succeed.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
