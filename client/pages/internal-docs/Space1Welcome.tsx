import InternalDocsLayout from "./InternalDocsLayout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Space1Welcome() {
  return (
    <InternalDocsLayout
      title="Welcome to the AeThex Ecosystem"
      description="Your guide to how we operate"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome, Team Member
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We are building a new architecture for trust. This hub is our single
            source of truth—one place where you can understand:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">→</span>
              <span>How our 3-entity model works</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">→</span>
              <span>Who you are in this ecosystem</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">→</span>
              <span>The rules that govern us all</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">→</span>
              <span>Your role and responsibilities</span>
            </li>
          </ul>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/internal-docs/axiom-model"
            className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all cursor-pointer"
          >
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              The Axiom Model
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Understand our 3-entity structure: The Foundation, The LLC, and
              The Corp.
            </p>
            <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium">
              Learn more <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <Link
            to="/internal-docs/find-your-role"
            className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all cursor-pointer"
          >
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Find Your Role
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Which entity do you work for? Click your role to see your SOP.
            </p>
            <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium">
              Get started <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          <Link
            to="/internal-docs/code-of-conduct"
            className="group p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all cursor-pointer"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Core Rules
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Code of conduct, communication protocol, and ecosystem-wide
              standards.
            </p>
            <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium">
              View policies <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="font-bold text-white mb-4">🗺️ Hub Navigation</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase">
                🌍 Ecosystem-Wide
              </h4>
              <p className="text-sm text-slate-400 mb-2">
                Rules and policies that apply to everyone:
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Code of Conduct</li>
                <li>• Communication Protocol</li>
                <li>• Meeting Cadence</li>
                <li>• Brand & Voice Guide</li>
                <li>• Tech Stack Overview</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase">
                🏛️ Entity Hubs
              </h4>
              <p className="text-sm text-slate-400 mb-2">
                Deep dives by entity:
              </p>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• The Foundation (Non-Profit)</li>
                <li>• The LLC (IP Vault)</li>
                <li>• The Corp (For-Profit)</li>
                <li>• People & Finance Ops</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>⚠️ Confidential:</strong> This hub contains internal
            operational documents. Do not share outside AeThex.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
