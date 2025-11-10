import InternalDocsLayout from "./InternalDocsLayout";

export default function Space3CommunityPrograms() {
  return (
    <InternalDocsLayout
      title="Community Programs"
      description="The University - Education & Talent Pipeline"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            The Foundation runs community programs to educate, mentor, and
            empower the next generation of builders. These programs are the
            heart of our public mission.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Core Programs</h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🎓 Architect Nomination Program
              </h4>
              <p className="text-sm text-slate-300 mb-3">
                Identify and elevate community leaders to Architect status.
              </p>
              <div className="text-sm text-slate-300 space-y-2 pl-4">
                <p>
                  <strong>Who:</strong> Experienced developers, mentors,
                  contributors
                </p>
                <p>
                  <strong>Benefits:</strong> Special recognition, mentor status,
                  revenue share from platform
                </p>
                <p>
                  <strong>Process:</strong> SOP-003: Architect Nomination
                  Process
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                👥 Mentorship Program
              </h4>
              <p className="text-sm text-slate-300 mb-3">
                Pair experienced mentors with aspiring developers for growth and
                learning.
              </p>
              <div className="text-sm text-slate-300 space-y-2 pl-4">
                <p>
                  <strong>Duration:</strong> 12-week program
                </p>
                <p>
                  <strong>Structure:</strong> Weekly meetings, project work,
                  feedback
                </p>
                <p>
                  <strong>Outcomes:</strong> Mentees build portfolio, get job
                  leads
                </p>
                <p>
                  <strong>Documentation:</strong> 11-Part Mentorship Plan
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🎮 GameForge Dev Gym
              </h4>
              <p className="text-sm text-slate-300 mb-3">
                A non-profit "gym" for game developers to learn, build, and ship
                together.
              </p>
              <div className="text-sm text-slate-300 space-y-2 pl-4">
                <p>
                  <strong>Focus:</strong> Monthly game jams, shared resources,
                  community
                </p>
                <p>
                  <strong>Tools:</strong> Free access to GameForge tools and
                  templates
                </p>
                <p>
                  <strong>Community:</strong> Discord community, peer feedback
                </p>
                <p>
                  <strong>Documentation:</strong> 11-Part GameForge Plan
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Program Principles
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">🔓 Open Access</h4>
              <p className="text-sm text-slate-300">
                No gatekeeping. All programs are free or low-cost. Accessible to
                anyone.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🤝 Community-Driven
              </h4>
              <p className="text-sm text-slate-300">
                Programs are shaped by community feedback. Community members
                volunteer as mentors.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                📈 Outcomes Focus
              </h4>
              <p className="text-sm text-slate-300">
                We track results: job placements, skills gained, portfolio
                built, retention.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">💰 Sustainable</h4>
              <p className="text-sm text-slate-300">
                Funded by Foundation grants and corporate sponsorships, never by
                participant fees.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Participation Paths
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                As a Learner/Participant
              </h4>
              <ol className="text-sm text-slate-300 space-y-2 pl-4 list-decimal">
                <li>Apply to program (online form)</li>
                <li>Get accepted (we accept most applicants)</li>
                <li>Show up, participate, build</li>
                <li>Graduate and get job leads</li>
              </ol>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                As a Mentor/Volunteer
              </h4>
              <ol className="text-sm text-slate-300 space-y-2 pl-4 list-decimal">
                <li>
                  Express interest in mentorship (Discord or application form)
                </li>
                <li>Get matched with mentee</li>
                <li>Meet weekly, provide feedback, guide project</li>
                <li>Get recognized and credited</li>
              </ol>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">As an Architect</h4>
              <ol className="text-sm text-slate-300 space-y-2 pl-4 list-decimal">
                <li>Get nominated or self-nominate</li>
                <li>Go through nomination process</li>
                <li>
                  Get elevated to Architect (special badge, revenue share,
                  mentorship role)
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Outcomes & Metrics
          </h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <p className="font-semibold text-white">We track:</p>
            <ul className="text-sm text-slate-300 space-y-2 pl-4">
              <li>
                <strong>Participation:</strong> Number of participants by
                program
              </li>
              <li>
                <strong>Completion:</strong> % who finish vs. drop out
              </li>
              <li>
                <strong>Skills:</strong> Pre/post assessment of skills gained
              </li>
              <li>
                <strong>Employment:</strong> Job placements in dev roles
              </li>
              <li>
                <strong>Retention:</strong> Participants who stay engaged
              </li>
              <li>
                <strong>Feedback:</strong> Satisfaction surveys post-program
              </li>
            </ul>
            <p className="text-xs text-slate-400 mt-3">
              All outcomes are public. See annual impact report.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            How Programs Are Funded
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                📊
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Foundation Grants
                </p>
                <p className="text-sm text-slate-300">
                  Base funding from Foundation endowment
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                🤝
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Corporate Sponsorship
                </p>
                <p className="text-sm text-slate-300">
                  Companies sponsor individual programs (non-binding, no
                  strings)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                🎁
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Individual Donors
                </p>
                <p className="text-sm text-slate-300">
                  Community members donate to support specific programs
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                💰
              </div>
              <div>
                <p className="font-semibold text-white mb-1">
                  Platform Revenue Share
                </p>
                <p className="text-sm text-slate-300">
                  Portion of Nexus fees go back to Foundation (reinvested in
                  programs)
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Want to help?</strong> Join Discord, volunteer as a mentor,
            or sponsor a program. Details: foundation@aethex.tech
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
