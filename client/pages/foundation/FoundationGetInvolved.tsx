import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  MessageSquare,
  Trophy,
  ArrowRight,
  CheckCircle,
  Zap,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationGetInvolved() {
  const navigate = useNavigate();

  const involvementWays = [
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with thousands of developers worldwide",
      actions: [
        "Join our Discord server",
        "Attend community events",
        "Participate in discussions",
        "Share your projects",
      ],
    },
    {
      icon: Calendar,
      title: "Attend Workshops",
      description: "Learn from experts in interactive sessions",
      actions: [
        "Beginner workshops",
        "Advanced seminars",
        "Live coding sessions",
        "Q&A with experts",
      ],
    },
    {
      icon: MessageSquare,
      title: "Mentor & Learn",
      description: "Help others and grow through mentorship",
      actions: [
        "Become a mentor",
        "Find a mentor",
        "Peer learning groups",
        "Knowledge sharing",
      ],
    },
    {
      icon: Trophy,
      title: "Showcase Your Work",
      description: "Get recognition for your projects",
      actions: [
        "Submit projects",
        "Win recognition",
        "Get featured",
        "Build your portfolio",
      ],
    },
  ];

  const communityChannels = [
    {
      name: "Discord Server",
      description: "Real-time chat with the community",
      members: "5K+",
      status: "Active",
      icon: MessageSquare,
    },
    {
      name: "GitHub Discussions",
      description: "Ask questions and share ideas",
      members: "2K+",
      status: "Active",
      icon: Users,
    },
    {
      name: "Monthly Meetups",
      description: "In-person and virtual meetups",
      members: "500+",
      status: "Monthly",
      icon: Calendar,
    },
    {
      name: "Forum",
      description: "Deep discussions and long-form posts",
      members: "3K+",
      status: "Active",
      icon: MessageSquare,
    },
  ];

  const events = [
    {
      title: "Game Jam - January 2025",
      date: "Jan 25-27, 2025",
      type: "Competition",
      participants: "200+",
      prize: "$5K",
    },
    {
      title: "Dev Talk Series",
      date: "Every 2nd Tuesday",
      type: "Workshop",
      participants: "100+",
      prize: "Certificates",
    },
    {
      title: "Roblox Creator Summit",
      date: "Mar 15-17, 2025",
      type: "Conference",
      participants: "1K+",
      prize: "Sponsorships",
    },
    {
      title: "Multiplayer Game Hackathon",
      date: "Feb 8-9, 2025",
      type: "Competition",
      participants: "150+",
      prize: "$3K",
    },
  ];

  const mentorshipProgram = [
    {
      role: "Junior Developer",
      duration: "12 weeks",
      description: "Learn game development fundamentals with a mentor",
      commitment: "5-10 hours/week",
    },
    {
      role: "Intermediate Developer",
      duration: "8 weeks",
      description: "Master advanced concepts and best practices",
      commitment: "3-5 hours/week",
    },
    {
      role: "Advanced Developer",
      duration: "Ongoing",
      description: "Mentor others and contribute to major projects",
      commitment: "2-4 hours/week",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(239,68,68,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-red-300 hover:bg-red-500/10 mb-8"
                onClick={() => navigate("/foundation")}
              >
                ← Back to Foundation
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-red-300 mb-4">
                Get Involved
              </h1>
              <p className="text-lg text-red-100/80 max-w-3xl">
                Join our thriving community of developers. Whether you're just
                starting or a seasoned pro, there's a place for you here.
              </p>
            </div>
          </section>

          {/* Ways to Get Involved */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Ways to Participate
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {involvementWays.map((way, idx) => {
                  const Icon = way.icon;
                  return (
                    <Card key={idx} className="bg-red-950/20 border-red-400/30">
                      <CardContent className="pt-6">
                        <Icon className="h-8 w-8 text-red-400 mb-3" />
                        <h3 className="text-lg font-bold text-red-300 mb-2">
                          {way.title}
                        </h3>
                        <p className="text-sm text-red-200/70 mb-4">
                          {way.description}
                        </p>
                        <ul className="space-y-2">
                          {way.actions.map((action, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-red-300"
                            >
                              <CheckCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Community Channels */}
          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Community Channels
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {communityChannels.map((channel, idx) => {
                  const Icon = channel.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <Icon className="h-6 w-6 text-red-400" />
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                            {channel.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-red-300 mb-2">
                          {channel.name}
                        </h3>
                        <p className="text-sm text-red-200/70 mb-4">
                          {channel.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-red-400 font-semibold">
                            {channel.members} members
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-300 hover:bg-red-500/10"
                          >
                            Join →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {events.map((event, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-red-300 mb-1">
                            {event.title}
                          </h3>
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                            {event.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-red-400 font-semibold mb-1">
                            DATE
                          </p>
                          <p className="text-red-300">{event.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-400 font-semibold mb-1">
                            PARTICIPANTS
                          </p>
                          <p className="text-red-300">{event.participants}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-400 font-semibold mb-1">
                            PRIZE/REWARD
                          </p>
                          <p className="text-red-300 font-semibold">
                            {event.prize}
                          </p>
                        </div>
                        <div className="flex items-end">
                          <Button
                            className="w-full bg-red-400 text-black hover:bg-red-300"
                            size="sm"
                          >
                            Register
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Mentorship Program */}
          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Mentorship Programs
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mentorshipProgram.map((program, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-400/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-red-300">
                          {program.role}
                        </h3>
                        <Heart className="h-5 w-5 text-red-400" />
                      </div>
                      <p className="text-sm text-red-200/70 mb-4">
                        {program.description}
                      </p>
                      <div className="space-y-2 pt-4 border-t border-red-400/10">
                        <div>
                          <p className="text-xs text-red-400 font-semibold">
                            DURATION
                          </p>
                          <p className="text-red-300">{program.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-400 font-semibold">
                            TIME COMMITMENT
                          </p>
                          <p className="text-red-300">{program.commitment}</p>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 bg-red-400 text-black hover:bg-red-300"
                        size="sm"
                      >
                        {idx === 0
                          ? "Find a Mentor"
                          : idx === 1
                            ? "Upgrade Level"
                            : "Become a Mentor"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Community Stats */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Our Community
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: "Active Members", value: "10K+" },
                  { label: "Projects Shared", value: "5K+" },
                  { label: "Monthly Events", value: "20+" },
                  { label: "Open Issues", value: "500+" },
                ].map((stat, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/30 border-red-400/40 text-center"
                  >
                    <CardContent className="pt-6">
                      <p className="text-3xl font-black text-red-400 mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-red-200/70">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-red-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-red-300 mb-4">
                Ready to Join?
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Whether you want to learn, teach, build, or contribute, there's
                a community of developers waiting for you.
              </p>
              <Button
                className="bg-red-400 text-black shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:bg-red-300"
                onClick={() => navigate("/foundation/contribute")}
              >
                Start Contributing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
