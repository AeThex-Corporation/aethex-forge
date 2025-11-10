import InternalDocsLayout from "./InternalDocsLayout";

export default function Space2MeetingCadence() {
  return (
    <InternalDocsLayout
      title="Master Meeting & Reporting Cadence"
      description="When & How We Meet"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            A predictable meeting cadence helps us stay aligned without drowning
            in meetings. This schedule applies to all entities. Adjust as needed
            for your team, but don't exceed this baseline.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            All-Hands Meetings
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🏢 Full Ecosystem All-Hands
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Quarterly (every 3 months)
                </p>
                <p>
                  <strong>Duration:</strong> 90 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> All AeThex team members
                  (mandatory)
                </p>
                <p>
                  <strong>Agenda:</strong> Ecosystem updates, strategic
                  announcements, Q&A
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🏛️ Entity All-Hands
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Monthly (last Friday of month)
                </p>
                <p>
                  <strong>Duration:</strong> 60 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> All members of that entity
                </p>
                <p>
                  <strong>Agenda:</strong> Entity news, performance, updates
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Team Meetings</h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                📊 Team Stand-up
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> 2-3x per week (team-dependent)
                </p>
                <p>
                  <strong>Duration:</strong> 15 minutes
                </p>
                <p>
                  <strong>Format:</strong> Async or quick sync
                </p>
                <p>
                  <strong>What:</strong> Quick status updates: what I did, what
                  I'm doing, blockers
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                📈 Weekly Planning
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Once per week (Monday)
                </p>
                <p>
                  <strong>Duration:</strong> 30-60 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> Team leads + managers
                </p>
                <p>
                  <strong>What:</strong> Prioritize week, address blockers,
                  align on goals
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🎯 Sprint Review
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Every 2 weeks (sprint-dependent)
                </p>
                <p>
                  <strong>Duration:</strong> 60 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> Team + stakeholders
                </p>
                <p>
                  <strong>What:</strong> Demo completed work, gather feedback
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Leadership Meetings
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                👔 Executive Staff Meeting
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Weekly
                </p>
                <p>
                  <strong>Duration:</strong> 90 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> C-suite, department heads
                </p>
                <p>
                  <strong>What:</strong> Strategic decisions, cross-entity
                  coordination, metrics review
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                📊 Department Syncs
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Bi-weekly
                </p>
                <p>
                  <strong>Duration:</strong> 60 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> Department heads + leads
                </p>
                <p>
                  <strong>What:</strong> Cross-team coordination, resource
                  allocation, problem-solving
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Individual Meetings
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                1️⃣ 1-on-1 (Manager)
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Weekly or bi-weekly
                </p>
                <p>
                  <strong>Duration:</strong> 30 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> Manager + individual contributor
                </p>
                <p>
                  <strong>What:</strong> Feedback, growth, career development,
                  wellbeing
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                🎯 Quarterly Reviews
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Frequency:</strong> Every 3 months
                </p>
                <p>
                  <strong>Duration:</strong> 60 minutes
                </p>
                <p>
                  <strong>Attendees:</strong> Manager + individual contributor
                </p>
                <p>
                  <strong>What:</strong> Performance review, goal setting,
                  compensation discussion
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Meeting Rules</h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
            <p className="text-sm text-slate-300">
              <strong>✓ START ON TIME</strong> - Respect everyone's time
            </p>
            <p className="text-sm text-slate-300">
              <strong>✓ HAVE AN AGENDA</strong> - Share it 24 hours before
            </p>
            <p className="text-sm text-slate-300">
              <strong>✓ RECORD DECISIONS</strong> - Document what was decided
              and who owns it
            </p>
            <p className="text-sm text-slate-300">
              <strong>✓ OPTIONAL ATTENDANCE</strong> - Make it clear if
              attendance is optional
            </p>
            <p className="text-sm text-slate-300">
              <strong>✗ DON'T LIVE REMOTE</strong> - Either all remote or all
              in-person (no hybrid)
            </p>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Goal:</strong> Maximum alignment, minimum meeting time. If a
            meeting doesn't produce decisions, don't have it.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
