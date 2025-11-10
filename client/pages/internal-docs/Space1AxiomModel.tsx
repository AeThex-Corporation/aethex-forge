import InternalDocsLayout from "./InternalDocsLayout";
import { Shield, Zap, Users } from "lucide-react";

export default function Space1AxiomModel() {
  return (
    <InternalDocsLayout
      title="The Axiom Model"
      description="Our 3-Entity Structure for Building with Purpose & Profit"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            AeThex is not one company—it's a purpose-driven ecosystem of three
            distinct legal entities, each with a specific role in our mission to
            build innovative products while maintaining community trust.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Foundation */}
          <div className="border-2 border-red-500/50 bg-red-900/10 rounded-lg p-6">
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              The Foundation
            </h3>
            <p className="text-sm text-red-400 font-semibold mb-3 uppercase">
              The Guardian (Non-Profit)
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Purpose:
                </p>
                <p className="text-xs text-slate-400">
                  Steward the public good, nurture community, maintain trust
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">Owns:</p>
                <ul className="text-xs text-slate-400 space-y-1 pl-4">
                  <li>• Axiom Protocol (AI Ethics)</li>
                  <li>• Nexus (Talent Marketplace)</li>
                  <li>• GameForge (Dev Gym)</li>
                  <li>��� Community Programs</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Members:
                </p>
                <p className="text-xs text-slate-400">
                  Board, Community Managers, Developers
                </p>
              </div>
            </div>
          </div>

          {/* LLC */}
          <div className="border-2 border-blue-500/50 bg-blue-900/10 rounded-lg p-6">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-xl font-bold text-white mb-2">The LLC</h3>
            <p className="text-sm text-blue-400 font-semibold mb-3 uppercase">
              The Firewall (IP Vault)
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Purpose:
                </p>
                <p className="text-xs text-slate-400">
                  Hold intellectual property, protect assets, manage licensing
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Holds:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 pl-4">
                  <li>• Software Patents</li>
                  <li>• Brand Assets</li>
                  <li>• Technology IP</li>
                  <li>• Licensing Agreements</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">Role:</p>
                <p className="text-xs text-slate-400">
                  Financial separation & asset protection
                </p>
              </div>
            </div>
          </div>

          {/* Corp */}
          <div className="border-2 border-green-500/50 bg-green-900/10 rounded-lg p-6">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold text-white mb-2">The Corp</h3>
            <p className="text-sm text-green-400 font-semibold mb-3 uppercase">
              The Engine (For-Profit)
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Purpose:
                </p>
                <p className="text-xs text-slate-400">
                  Generate revenue, build products, deliver client services
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Operates:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 pl-4">
                  <li>• Labs (R&D)</li>
                  <li>• GameForge (Studios)</li>
                  <li>• Consulting (Client Work)</li>
                  <li>• Products & Services</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium mb-1">Team:</p>
                <p className="text-xs text-slate-400">
                  Employees, Contractors, Operations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            How They Work Together
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                1
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  The Corp Innovates
                </p>
                <p className="text-sm text-slate-400">
                  The Corp develops products, serves clients, and creates
                  revenue.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                2
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  The LLC Protects IP
                </p>
                <p className="text-sm text-slate-400">
                  Intellectual property is licensed to The Corp, insulating it
                  from liability.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                3
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  The Foundation Stewards
                </p>
                <p className="text-sm text-slate-400">
                  Community programs, open-source initiatives, and public
                  mission are protected as non-profit activities.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                4
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Everyone Wins</p>
                <p className="text-sm text-slate-400">
                  Profits flow to The Corp. Community benefits flow to The
                  Foundation. Assets are protected by The LLC.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h4 className="font-bold text-white mb-4">Legal Separation</h4>
            <p className="text-sm text-slate-300 mb-3">
              Each entity is a distinct legal person, but they work together:
            </p>
            <ul className="text-sm text-slate-300 space-y-2 pl-4">
              <li>✓ Clear governance boundaries</li>
              <li>✓ No commingling of funds</li>
              <li>✓ Separate tax treatment</li>
              <li>✓ Liability firewalls</li>
              <li>✓ Transparent relationships</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h4 className="font-bold text-white mb-4">Financial Flow</h4>
            <p className="text-sm text-slate-300 mb-3">
              How money moves through the ecosystem:
            </p>
            <ul className="text-sm text-slate-300 space-y-2 pl-4">
              <li>→ Corp revenue → Employees & Operations</li>
              <li>→ Licensing fees → Foundation & IP holder</li>
              <li>→ Profits → Shareholder return</li>
              <li>→ Community fund → Public benefit</li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Key Principle:</strong> The Axiom Model lets us operate with
            purpose and profit. Community trust is our competitive advantage.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
