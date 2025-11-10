import InternalDocsLayout from "./InternalDocsLayout";

export default function Space2BrandVoice() {
  return (
    <InternalDocsLayout
      title="Brand & Voice Guide"
      description="How We Talk About AeThex Publicly"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            Every team member is an ambassador for AeThex. When you talk about
            us publicly (social media, conferences, press), use this guide to
            stay on brand and on message.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Brand Essence</h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-blue-400 uppercase mb-2">
                Who We Are
              </p>
              <p className="text-slate-300">
                AeThex is a purpose-driven technology company building
                innovative products while maintaining community trust. We
                operate as a 3-entity ecosystem: The Foundation (non-profit),
                The LLC (IP vault), and The Corp (for-profit).
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-400 uppercase mb-2">
                Why We Exist
              </p>
              <p className="text-slate-300">
                We're building a new architecture for trust. Technology should
                serve both profit and purpose. We prove it's possible.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-400 uppercase mb-2">
                How We Operate
              </p>
              <p className="text-slate-300">
                With transparency, accountability, and integrity. We separate
                innovation, protection, and delivery. We're open about our
                values and willing to be held accountable.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Tone & Voice</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-3">
                ✓ We Sound Like
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>
                  <strong>Honest:</strong> We admit mistakes and limitations
                </li>
                <li>
                  <strong>Clear:</strong> We explain complex ideas simply
                </li>
                <li>
                  <strong>Confident:</strong> We believe in what we're building
                </li>
                <li>
                  <strong>Humble:</strong> We know we're still learning
                </li>
                <li>
                  <strong>Human:</strong> We're approachable and real
                </li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-3">✗ Not Like</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>
                  <strong>Arrogant:</strong> We don't claim to be the best
                </li>
                <li>
                  <strong>Buzzwordy:</strong> We avoid corporate speak
                </li>
                <li>
                  <strong>Preachy:</strong> We show, we don't tell
                </li>
                <li>
                  <strong>Vague:</strong> We get specific
                </li>
                <li>
                  <strong>Sales-y:</strong> We're not always selling
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Core Messages</h3>
          <div className="space-y-3">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">
                1. Innovation with Purpose
              </p>
              <p className="text-sm text-slate-300">
                We're building technology that makes money AND makes a
                difference. Profit and purpose aren't mutually exclusive.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">
                2. Transparent Operations
              </p>
              <p className="text-sm text-slate-300">
                Our 3-entity model separates innovation, protection, and
                delivery. We're open about our structure because it's nothing to
                hide.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">
                3. Community-First
              </p>
              <p className="text-sm text-slate-300">
                We invest in communities, developers, and creatives. We build
                with them, not at them.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-white mb-2">
                4. Technical Excellence
              </p>
              <p className="text-sm text-slate-300">
                We sweat the details. Our products are built by craftspeople who
                care about quality.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Platform Messaging
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-blue-400 mb-2">🧪 Labs</p>
              <p className="text-sm text-slate-300 mb-2">
                "Where innovation happens. We research, experiment, and publish
                findings for the community."
              </p>
              <p className="text-xs text-slate-500">
                Focus: research, open-source, community benefit
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-green-400 mb-2">🎮 GameForge</p>
              <p className="text-sm text-slate-300 mb-2">
                "Building games better. We prove that monthly shipping cycles
                and technical excellence aren't mutually exclusive."
              </p>
              <p className="text-xs text-slate-500">
                Focus: creative tools, developer experience, studio efficiency
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-yellow-400 mb-2">💼 Corp</p>
              <p className="text-sm text-slate-300 mb-2">
                "We help enterprises build better. From consulting to custom
                solutions, we apply deep technical expertise to real problems."
              </p>
              <p className="text-xs text-slate-500">
                Focus: client success, reliability, results
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-red-400 mb-2">🏛️ Foundation</p>
              <p className="text-sm text-slate-300 mb-2">
                "Community first. We invest in education, open-source, and
                creating opportunities for the next generation."
              </p>
              <p className="text-xs text-slate-500">
                Focus: public benefit, mentorship, community
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Writing Guidelines
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">✓ DO</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>
                  • Be specific: "We shipped X" not "We shipped great things"
                </li>
                <li>• Use "we" and "us" to build community</li>
                <li>• Tell stories about real problems we solve</li>
                <li>• Reference our values when appropriate</li>
                <li>• Cite sources and give credit</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">✗ DON'T</h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Use corporate jargon ("synergy," "disruptive," etc.)</li>
                <li>• Make claims we can't back up</li>
                <li>• Denigrate competitors</li>
                <li>• Share confidential information</li>
                <li>• Speak on behalf of team members without permission</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Golden Rule:</strong> When in doubt, ask: "Would I be
            comfortable if this went viral?" If yes, post. If no, don't.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
