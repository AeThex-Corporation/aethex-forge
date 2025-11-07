import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Zap, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationGetInvolved() {
  const navigate = useNavigate();

  const events = [
    {
      title: "Weekly Game Dev Workshop",
      date: "Every Saturday, 10 AM",
      attendees: "150+/week",
      level: "Beginner",
      description: "Interactive sessions on game development fundamentals",
    },
    {
      title: "Roblox Developer Meetup",
      date: "1st Thursday, 7 PM",
      attendees: "50+/month",
      level: "All Levels",
      description: "Connect with other Roblox developers in your area",
    },
    {
      title: "Advanced Architecture Conference",
      date: "Monthly",
      attendees: "200+",
      level: "Advanced",
      description: "Deep dive into scalable game architecture",
    },
    {
      title: "Game Jam Challenge",
      date: "Quarterly",
      attendees: "500+",
      level: "All Levels",
      description: "Build a game in 48 hours and compete",
    },
  ];

  const ways = [
    {
      title: "Attend Workshops",
      description: "Join our free community workshops and learn from experts",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Join Discussions",
      description: "Participate in forums and ask questions in Discord",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Volunteer",
      description: "Help organize events and mentor new developers",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Share Knowledge",
      description: "Write tutorials or speak at our events",
      icon: <Zap className="h-6 w-6" />,
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(239,68,68,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
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
                Get Involved in the Community
              </h1>
              <p className="text-lg text-red-100/80 max-w-3xl">
                Join 50K+ developers building and learning together.
              </p>
            </div>
          </section>

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
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-red-300">
                            {event.title}
                          </h3>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            WHEN
                          </p>
                          <p className="text-sm text-red-200/70">
                            {event.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            LEVEL
                          </p>
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                            {event.level}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            ATTENDEES
                          </p>
                          <p className="text-sm text-red-300">
                            {event.attendees}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Ways to Participate
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {ways.map((way, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="text-red-400 mb-3">{way.icon}</div>
                      <h3 className="text-lg font-bold text-red-300 mb-2">
                        {way.title}
                      </h3>
                      <p className="text-sm text-red-200/70">
                        {way.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-red-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-red-300 mb-4">
                Ready to Join?
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Sign up for events and connect with other developers.
              </p>
              <Button
                className="bg-red-400 text-black hover:bg-red-300"
              >
                Register for Next Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
