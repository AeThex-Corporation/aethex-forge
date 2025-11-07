import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  image: string;
}

interface Testimonial {
  id: number;
  author: string;
  role: string;
  company: string;
  quote: string;
  result: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Lead Developer",
    bio: "15+ years in game development. Previously shipped 20+ titles.",
    expertise: ["Game Architecture", "Performance", "Team Leadership"],
    image: "https://via.placeholder.com/150/22c55e/000000?text=SC",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Community Lead",
    bio: "Built communities with 100k+ active developers across platforms.",
    expertise: ["Community Building", "Mentorship", "Events"],
    image: "https://via.placeholder.com/150/22c55e/000000?text=MJ",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Product Manager",
    bio: "Passionate about making game dev tools accessible to everyone.",
    expertise: ["Product Strategy", "UX Design", "Developer Experience"],
    image: "https://via.placeholder.com/150/22c55e/000000?text=ER",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: "James Park",
    role: "Indie Developer",
    company: "Park Studios",
    quote:
      "GameForge transformed how we ship games. Monthly releases that used to take quarters are now our standard.",
    result: "+300% faster development cycle",
  },
  {
    id: 2,
    author: "Olivia Smith",
    role: "Game Designer",
    company: "Creative Digital",
    quote:
      "The community support and resources made all the difference. I went from zero to published in 6 months.",
    result: "1st game launched successfully",
  },
  {
    id: 3,
    author: "David Kumar",
    role: "Technical Lead",
    company: "Quantum Games",
    quote:
      "Best decision we made was joining GameForge. The tooling alone saved us months of development time.",
    result: "Saved 4 months of dev time",
  },
];

const MEMBERSHIP_BENEFITS = [
  "Priority access to new features and tools",
  "Monthly revenue sharing from successful games",
  "Dedicated technical support and mentorship",
  "Featured placement in our game gallery",
  "Access to exclusive GameForge community events",
  "Co-marketing opportunities with AeThex",
];

export default function GameForgeJoinGameForge() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <Badge className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] mb-4">
                <Users className="h-4 w-4 mr-2" />
                Join Our Community
              </Badge>
              <h1 className="text-4xl font-black text-green-300 mb-4 lg:text-5xl">
                Become a GameForge Member
              </h1>
              <p className="text-lg text-green-100/80 max-w-2xl">
                Join thousands of developers who are shipping games faster,
                building stronger products, and growing their audiences.
              </p>
            </div>
          </section>

          {/* Meet the Team */}
          <section className="py-16 border-y border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Meet the Team
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {TEAM_MEMBERS.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-green-950/20 border-green-400/30 overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-b from-green-500/20 to-transparent flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-green-400/20 border border-green-400/40 flex items-center justify-center text-2xl font-bold text-green-300">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-green-300">
                          {member.name}
                        </h3>
                        <p className="text-sm text-green-400">{member.role}</p>
                      </div>
                      <p className="text-sm text-green-200/70">{member.bio}</p>
                      <div className="space-y-2">
                        {member.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 text-xs bg-green-500/10 border border-green-400/30 rounded text-green-300 mr-2"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Success Stories
              </h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {TESTIMONIALS.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-2 mb-4">
                        <Quote className="h-5 w-5 text-green-400 flex-shrink-0" />
                      </div>
                      <p className="text-green-100 mb-4 italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="space-y-3 pt-4 border-t border-green-400/10">
                        <div>
                          <p className="font-semibold text-green-300">
                            {testimonial.author}
                          </p>
                          <p className="text-sm text-green-200/70">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 border border-green-400/40 text-green-300">
                          {testimonial.result}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Membership Benefits */}
          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Membership Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {MEMBERSHIP_BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-100">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-lg text-green-100/80 mb-6">
                  Ready to ship faster and build better games?
                </p>
                <Button className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300 px-8 py-6 text-lg">
                  Apply for Membership
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
