import InternalDocsLayout from "./InternalDocsLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Space1FindYourRole() {
  const roles = [
    {
      id: "w2-employee",
      emoji: "👔",
      title: "W-2 Employee",
      subtitle: "of The AeThex Corp",
      description:
        "You're on our payroll. You have salary, benefits, and direct reports.",
      docLink: "/internal-docs/onboarding",
      docTitle: "Employee Handbook",
      details: [
        "Full-time position at The Corp",
        "Eligible for health insurance, PTO, retirement",
        "Report to a manager",
        "Covered by employment law",
      ],
    },
    {
      id: "contractor",
      emoji: "🔧",
      title: "Project Contractor",
      subtitle: "of The AeThex Corp",
      description:
        "You work on specific projects with defined scope, timeline, and budget.",
      docLink: "/internal-docs/finance",
      docTitle: "Contractor SOP",
      details: [
        "Project-based engagement",
        "Invoice-based payment",
        "Defined deliverables",
        "1099 independent contractor",
      ],
    },
    {
      id: "community",
      emoji: "🌱",
      title: "Community Member",
      subtitle: "of The AeThex Foundation",
      description:
        "You're part of our community programs, open-source initiatives, or mentorship.",
      docLink: "/internal-docs/foundation-programs",
      docTitle: "Community Developer SOP",
      details: [
        "Volunteer or community contributor",
        "Participate in programs & initiatives",
        "Access to community resources",
        "Part of our public mission",
      ],
    },
  ];

  return (
    <InternalDocsLayout
      title="Who Are You?"
      description="Find your role in the AeThex ecosystem"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            Your role determines which set of rules, policies, and processes
            apply to you. Click your role below to see your SOP (Standard
            Operating Procedure) and responsibilities.
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 hover:border-blue-500/50 rounded-lg p-6 transition-all"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Role Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{role.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {role.title}
                      </h3>
                      <p className="text-sm text-blue-400 font-semibold">
                        {role.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{role.description}</p>
                  <div className="bg-slate-900/50 rounded p-4">
                    <p className="text-xs text-slate-400 font-semibold mb-2 uppercase">
                      What this means:
                    </p>
                    <ul className="space-y-2">
                      {role.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-300 flex gap-2"
                        >
                          <span className="text-blue-400">→</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col justify-center">
                  <Link
                    to={role.docLink}
                    className="inline-flex items-center justify-between px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors group"
                  >
                    <span>{role.docTitle}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    View your SOP →
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Not Sure?</h3>
          <p className="text-slate-300 mb-4">
            If you're unsure which category applies to you, here's how to tell:
          </p>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">
                Do you receive a W-2 and regular paycheck?
              </p>
              <p className="text-sm text-slate-400">→ You're an Employee</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">
                Are you hired for a specific project with an end date?
              </p>
              <p className="text-sm text-slate-400">→ You're a Contractor</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">
                Do you participate in community programs or volunteer?
              </p>
              <p className="text-sm text-slate-400">
                → You're a Community Member
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Note:</strong> You might have multiple roles. For example,
            you could be an Employee AND a Community Member. In that case, refer
            to both SOPs.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
