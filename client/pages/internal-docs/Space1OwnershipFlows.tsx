import InternalDocsLayout from "./InternalDocsLayout";
import { Download, Monitor, FlaskConical, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

export default function Space1OwnershipFlows() {
  return (
    <InternalDocsLayout
      title="Ownership Flows"
      description="Practical Examples of Corp/Foundation Ownership in Action"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            This document illustrates how the Axiom Model manifests in real user journeys
            and internal operations. Understanding these flows is critical for maintaining
            legal entity separation while delivering a seamless user experience.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4">The Core Principle</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">Foundation Owns</h3>
              <p className="text-slate-300 text-sm">The <strong>Mission</strong> - Programs, curriculum, community governance</p>
            </div>
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">Corp Owns</h3>
              <p className="text-slate-300 text-sm">The <strong>Tool</strong> - Software, infrastructure, engineering</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2">
          User Journey Examples
        </h2>

        <div className="space-y-6">
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-900/50 rounded-lg">
                <Download className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Example 1: User Downloads GameForge Studio</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">User visits</span>
                    <code className="bg-slate-900 px-2 py-1 rounded text-green-400">aethex.dev/downloads</code>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-green-400">Stays on Corp domain</span>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1 pl-4">
                    <li>• Download button links to Corp-hosted binaries (GitHub releases or Corp CDN)</li>
                    <li>• The .exe is signed with Corp's code signing certificate</li>
                    <li>• User opens app → sees "GameForge Studio" branding (Foundation name, Corp-built tool)</li>
                  </ul>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <p className="text-xs text-slate-400">
                      <strong className="text-green-400">Why:</strong> Users are downloading Corp-built software. The Corp owns the codebase and infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-900/50 rounded-lg">
                <GraduationCap className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Example 2: User Accesses GameForge Dashboard</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-slate-400">User clicks "GameForge" on</span>
                    <code className="bg-slate-900 px-2 py-1 rounded text-blue-400">aethex.dev</code>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-red-400">Redirect to</span>
                    <code className="bg-slate-900 px-2 py-1 rounded text-red-400">aethex.foundation/gameforge</code>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1 pl-4">
                    <li>• User sees Foundation branding, curriculum, mentorship info</li>
                    <li>• URL bar shows <code className="text-red-400">aethex.foundation</code></li>
                    <li>• The Foundation domain reinforces this is a non-profit educational program</li>
                  </ul>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <p className="text-xs text-slate-400">
                      <strong className="text-red-400">Why:</strong> The Foundation owns the GameForge program. Users must see the Foundation URL to trust the non-profit mission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-900/50 rounded-lg">
                <FlaskConical className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Example 3: User Browses Labs Research</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-slate-400">User clicks "Labs" on</span>
                    <code className="bg-slate-900 px-2 py-1 rounded text-blue-400">aethex.dev</code>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-purple-400">Redirect to</span>
                    <code className="bg-slate-900 px-2 py-1 rounded text-purple-400">aethex.studio</code>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1 pl-4">
                    <li>• User sees proprietary R&D, experimental projects</li>
                    <li>• The separate domain signals this is the Corp's Skunkworks division</li>
                    <li>• Security-sensitive work with PII scrubbing and code monitoring</li>
                  </ul>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <p className="text-xs text-slate-400">
                      <strong className="text-purple-400">Why:</strong> Labs is proprietary Corp R&D. The separate domain protects IP and client confidentiality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-900/50 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Example 4: User Books a Consulting Call</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-slate-400">User visits</span>
                    <code className="bg-slate-900 px-2 py-1 rounded text-green-400">aethex.dev/corp/schedule-consultation</code>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-green-400">Stays on aethex.dev</span>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1 pl-4">
                    <li>• No redirect - this is the For-Profit's revenue-generating service</li>
                    <li>• Appropriately hosted on the commercial domain</li>
                    <li>• Client contracts, billing, and service delivery happen here</li>
                  </ul>
                  <div className="bg-slate-900/50 rounded p-3 mt-3">
                    <p className="text-xs text-slate-400">
                      <strong className="text-green-400">Why:</strong> Corp services generate revenue. The commercial domain is appropriate for for-profit activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2 mt-8">
          Internal Operations Example
        </h2>

        <div className="border border-amber-700/50 rounded-lg p-6 bg-amber-900/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-900/50 rounded-lg">
              <Monitor className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Example 5: Service Contract Flow (GameForge Studio .EXE)</h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  The Foundation needs the GameForge Studio desktop application to deliver its educational program.
                  Here's how the ownership and development flow works:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 rounded p-4 border border-slate-700">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <h4 className="text-red-400 font-semibold text-sm mb-1">Foundation Requests</h4>
                    <p className="text-xs text-slate-400">Foundation needs software to execute the GameForge Plan (KND-001)</p>
                  </div>
                  <div className="bg-slate-900/50 rounded p-4 border border-slate-700">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <h4 className="text-green-400 font-semibold text-sm mb-1">Corp Builds</h4>
                    <p className="text-xs text-slate-400">LABS team develops GameForge Studio .EXE as Custom Software Development</p>
                  </div>
                  <div className="bg-slate-900/50 rounded p-4 border border-slate-700">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <h4 className="text-amber-400 font-semibold text-sm mb-1">License/Donate</h4>
                    <p className="text-xs text-slate-400">Corp licenses software to Foundation (nominal fee or in-kind Service Donation)</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded p-4 mt-4">
                  <h4 className="text-white font-semibold mb-2">Why This Structure?</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li><strong className="text-green-400">Funding:</strong> The Corp has revenue (from EdTech/Consulting) to pay engineers. Non-profits can't fund app development.</li>
                    <li><strong className="text-purple-400">Security:</strong> Corp owns the codebase, enabling the LABS BOT to monitor for proprietary leaks and PII scrubbing.</li>
                    <li><strong className="text-amber-400">Tax Efficiency:</strong> Corp can write off donated development hours as a charitable contribution.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-2 mt-8">
          Routing Summary Table
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300">Route</th>
                <th className="text-left py-3 px-4 text-slate-300">Destination</th>
                <th className="text-left py-3 px-4 text-slate-300">Legal Entity</th>
                <th className="text-left py-3 px-4 text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-3 px-4"><code className="text-blue-400">/foundation/*</code></td>
                <td className="py-3 px-4 text-red-400">aethex.foundation</td>
                <td className="py-3 px-4 text-slate-300">Non-Profit (Guardian)</td>
                <td className="py-3 px-4"><span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs">Redirect</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-blue-400">/gameforge/*</code></td>
                <td className="py-3 px-4 text-red-400">aethex.foundation/gameforge</td>
                <td className="py-3 px-4 text-slate-300">Non-Profit (Program)</td>
                <td className="py-3 px-4"><span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs">Redirect</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-blue-400">/labs/*</code></td>
                <td className="py-3 px-4 text-purple-400">aethex.studio</td>
                <td className="py-3 px-4 text-slate-300">For-Profit (Skunkworks)</td>
                <td className="py-3 px-4"><span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs">Redirect</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-blue-400">/nexus/*</code></td>
                <td className="py-3 px-4 text-green-400">aethex.dev</td>
                <td className="py-3 px-4 text-slate-300">For-Profit (Monetization)</td>
                <td className="py-3 px-4"><span className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">Local</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-blue-400">/corp/*</code></td>
                <td className="py-3 px-4 text-green-400">aethex.dev</td>
                <td className="py-3 px-4 text-slate-300">For-Profit (Services)</td>
                <td className="py-3 px-4"><span className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs">Local</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6 mt-8">
          <h3 className="text-blue-400 font-bold mb-2">Key Takeaway</h3>
          <p className="text-slate-300 text-sm">
            The URL bar is the user's window into our legal structure. When they see <code className="text-red-400">aethex.foundation</code>, 
            they know they're interacting with the non-profit Guardian. When they see <code className="text-green-400">aethex.dev</code>, 
            they know they're on the commercial platform. This transparency builds trust and ensures legal compliance.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
