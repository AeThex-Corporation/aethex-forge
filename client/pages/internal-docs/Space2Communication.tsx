import InternalDocsLayout from "./InternalDocsLayout";

export default function Space2Communication() {
  return (
    <InternalDocsLayout
      title="Master Communication Protocol"
      description="How We Use Discord, Slack, and Email"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            Communication is how we coordinate, build trust, and move fast. This
            protocol defines which tools to use when, and how to communicate
            effectively across all entities.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Tool Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">
                    Tool
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">
                    Use For
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">
                    Response Time
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">
                    Who
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 font-semibold text-white">
                    Discord
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    Real-time chat, urgent issues, team coordination
                  </td>
                  <td className="py-3 px-4 text-slate-300">5 minutes</td>
                  <td className="py-3 px-4 text-slate-300">All team members</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 font-semibold text-white">Email</td>
                  <td className="py-3 px-4 text-slate-300">
                    Formal communication, decisions, legal records
                  </td>
                  <td className="py-3 px-4 text-slate-300">24 hours</td>
                  <td className="py-3 px-4 text-slate-300">All team members</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">
                    Meetings
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    Decisions, feedback, deep work, sensitive topics
                  </td>
                  <td className="py-3 px-4 text-slate-300">N/A</td>
                  <td className="py-3 px-4 text-slate-300">
                    Required participants
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Discord Etiquette
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Channels</h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>• #general - News, announcements</li>
                <li>• #random - Off-topic chat</li>
                <li>• #help - Technical support</li>
                <li>• Team channels: #labs, #gameforge, #corp, #foundation</li>
                <li>• Direct messages for private matters</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">⏰ Availability</h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  • Set your status: 🟢 Available, 🟡 Away, 🔴 Do Not Disturb
                </li>
                <li>• Urgent? Use @mention or DM</li>
                <li>• Non-urgent? Use threads to keep chat clean</li>
                <li>• Don't expect immediate responses outside work hours</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">🚫 No-Nos</h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>• Don't spam or flood channels</li>
                <li>• Don't share sensitive data in Discord</li>
                <li>• Don't @ everyone unless critical</li>
                <li>• Don't use Discord for major decisions</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">Email Protocol</h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                ✓ Use Email For:
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>• Policy updates and announcements</li>
                <li>• Important decisions with records</li>
                <li>• Formal communication with clients</li>
                <li>• Contracts, agreements, legal matters</li>
                <li>• Performance reviews, feedback</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Email Best Practices:
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>• Clear subject line (what is this email about?)</li>
                <li>• Keep it brief—use bullets when possible</li>
                <li>• Call out action items in bold or separate section</li>
                <li>• Reply within 24 hours</li>
                <li>• BCC sensitive distribution lists</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Meeting Culture
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                ✓ Schedule a Meeting When:
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>• You need to make a decision with stakeholders</li>
                <li>• The topic is sensitive or requires nuance</li>
                <li>• You need face-to-face (video) interaction</li>
                <li>• Async communication has broken down</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                ✗ Don't Schedule a Meeting When:
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>• You can send an email instead</li>
                <li>• It's just for updates (use async updates)</li>
                <li>• Only 1-2 people need to attend</li>
                <li>• It could be a quick Slack message</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Golden Rule:</strong> Async-first. Assume people are in
            different time zones. Default to email and Discord. Reserve meetings
            for high-value interactions.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
