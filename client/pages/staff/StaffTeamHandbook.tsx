import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Shield,
  Zap,
  Award,
} from "lucide-react";

interface HandbookSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  subsections: string[];
}

const sections: HandbookSection[] = [
  {
    id: "1",
    title: "Benefits & Compensation",
    icon: <Heart className="h-6 w-6" />,
    content: "Comprehensive benefits package including health, dental, vision",
    subsections: [
      "Health Insurance",
      "Retirement Plans",
      "Stock Options",
      "Flexible PTO",
    ],
  },
  {
    id: "2",
    title: "Company Policies",
    icon: <Shield className="h-6 w-6" />,
    content: "Core policies governing workplace conduct and expectations",
    subsections: [
      "Code of Conduct",
      "Harassment Policy",
      "Confidentiality",
      "Data Security",
    ],
  },
  {
    id: "3",
    title: "Time Off & Leave",
    icon: <Calendar className="h-6 w-6" />,
    content: "Vacation, sick leave, parental leave, and special circumstances",
    subsections: [
      "Paid Time Off",
      "Sick Leave",
      "Parental Leave",
      "Sabbatical",
    ],
  },
  {
    id: "4",
    title: "Remote Work & Flexibility",
    icon: <MapPin className="h-6 w-6" />,
    content: "Work from home policies, office hours, and location flexibility",
    subsections: ["WFH Policy", "Core Hours", "Office Access", "Equipment"],
  },
  {
    id: "5",
    title: "Professional Development",
    icon: <Zap className="h-6 w-6" />,
    content: "Learning opportunities, training budgets, and career growth",
    subsections: [
      "Training Budget",
      "Conference Attendance",
      "Internal Training",
      "Mentorship",
    ],
  },
  {
    id: "6",
    title: "Recognition & Awards",
    icon: <Award className="h-6 w-6" />,
    content: "Employee recognition programs and performance incentives",
    subsections: [
      "Spot Bonuses",
      "Team Awards",
      "Anniversary Recognition",
      "Excellence Awards",
    ],
  },
];

export default function StaffTeamHandbook() {
  return (
    <Layout>
      <SEO
        title="Team Handbook"
        description="AeThex team handbook, policies, and benefits"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-blue-100">
                  Team Handbook
                </h1>
                <p className="text-blue-200/70">
                  Benefits, policies, and team culture
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-blue-100">25</p>
                  <p className="text-sm text-blue-200/70">Days PTO</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-blue-100">100%</p>
                  <p className="text-sm text-blue-200/70">Health Coverage</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-blue-100">$5K</p>
                  <p className="text-sm text-blue-200/70">Learning Budget</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-blue-100">Flexible</p>
                  <p className="text-sm text-blue-200/70">Remote Work</p>
                </CardContent>
              </Card>
            </div>

            {/* Handbook Sections */}
            <div className="space-y-6">
              {sections.map((section) => (
                <Card
                  key={section.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                          {section.icon}
                        </div>
                        <div>
                          <CardTitle className="text-blue-100">
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            {section.content}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {section.subsections.map((subsection) => (
                        <Badge
                          key={subsection}
                          variant="secondary"
                          className="bg-slate-700/50 text-slate-300"
                        >
                          {subsection}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="mt-12 p-6 rounded-lg bg-slate-800/50 border border-blue-500/30">
              <h2 className="text-xl font-bold text-blue-100 mb-4">
                Have Questions?
              </h2>
              <p className="text-slate-300 mb-4">
                HR team is here to help with any handbook-related questions or
                to clarify company policies.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact HR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
