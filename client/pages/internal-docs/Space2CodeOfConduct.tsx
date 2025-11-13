import InternalDocsLayout from "./InternalDocsLayout";
import { AlertTriangle, CheckCircle, Users, Shield } from "lucide-react";

export default function Space2CodeOfConduct() {
  return (
    <InternalDocsLayout title="Code of Conduct" description="How We All Act">
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong>KND-004: Ecosystem Code of Conduct</strong>
          </p>
          <p className="text-slate-300 leading-relaxed">
            This Code of Conduct applies to every member of AeThex, regardless
            of role, entity, or seniority. It defines the minimum standards of
            behavior that protect our culture, trust, and mission across all AeThex spaces: nexus.aethex.dev, dev-link.me, Discord, and our offices.
          </p>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-400 mb-2">🔴 ZERO TOLERANCE POLICY</h3>
              <p className="text-slate-300 mb-3">
                We have zero tolerance for:
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• <strong>Hate speech, slurs, or discriminatory language</strong></li>
                <li>• <strong>Harassment, bullying, or intimidation</strong></li>
                <li>• <strong>Doxxing (publishing private information)</strong></li>
                <li>• <strong>Illegal content or activities</strong></li>
                <li>• <strong>Sexual harassment or unwanted advances</strong></li>
              </ul>
              <p className="text-sm text-red-400 font-semibold mt-3">Violators are banned immediately and reported to authorities if necessary.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-2xl font-bold text-white mb-4">Core Values</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">✓ Integrity</h4>
                <p className="text-sm text-slate-300">
                  Be honest, transparent, and accountable. Your word is your
                  bond.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">✓ Respect</h4>
                <p className="text-sm text-slate-300">
                  Treat all team members as equals. Differences are strengths.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">✓ Ownership</h4>
                <p className="text-sm text-slate-300">
                  Take responsibility for your work and its impact.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">✓ Excellence</h4>
                <p className="text-sm text-slate-300">
                  Strive for quality in all you do. Mediocrity is not an option.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">
              Behavioral Standards
            </h3>
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">
                  ✓ DO: Communicate Clearly
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 pl-4">
                  <li>• Be direct and honest in feedback</li>
                  <li>• Assume good intent in others</li>
                  <li>• Ask questions before judging</li>
                  <li>• Speak up about concerns early</li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">
                  ✗ DON'T: Disrespect Others
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 pl-4">
                  <li>• No harassment, discrimination, or bullying</li>
                  <li>• No exclusion based on identity</li>
                  <li>• No dismissing others' perspectives</li>
                  <li>• No undermining team members publicly</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">
                  ✓ DO: Respect Confidentiality
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 pl-4">
                  <li>• Keep internal information internal</li>
                  <li>• Don't share others' personal info</li>
                  <li>• Honor NDAs and legal agreements</li>
                  <li>• Report leaks immediately</li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">
                  ✗ DON'T: Breach Trust
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 pl-4">
                  <li>• No sharing secrets or gossip</li>
                  <li>• No backdoor dealing</li>
                  <li>• No conflicts of interest without disclosure</li>
                  <li>• No stealing credit for others' work</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">
              Conflict Resolution
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Private Conversation
                  </p>
                  <p className="text-sm text-slate-300">
                    Approach the person directly. Assume good intent. Listen.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Talk to Your Manager
                  </p>
                  <p className="text-sm text-slate-300">
                    If unresolved, escalate to your direct manager or lead.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Escalate to Leadership
                  </p>
                  <p className="text-sm text-slate-300">
                    For serious issues, escalate to HR or executive leadership.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  4
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Investigation & Resolution
                  </p>
                  <p className="text-sm text-slate-300">
                    Leadership investigates, determines resolution, and
                    communicates outcome.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">Consequences</h3>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <p className="text-sm text-slate-300 mb-4">
                Violations of this Code of Conduct will be addressed promptly
                and fairly. Consequences depend on severity and intent, and may
                include:
              </p>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>1. Verbal warning and coaching</li>
                <li>2. Written warning and improvement plan</li>
                <li>3. Suspension or temporary leave</li>
                <li>4. Termination of employment or contract</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Questions?</strong> Contact HR or your manager. This Code
            applies to everyone. No exceptions.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
