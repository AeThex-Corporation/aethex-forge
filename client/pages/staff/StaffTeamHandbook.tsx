import { useState, useEffect } from "react";
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
  Calendar,
  MapPin,
  Users,
  Shield,
  Zap,
  Award,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface HandbookSection {
  id: string;
  category: string;
  title: string;
  content: string;
  order_index: number;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Benefits":
      return <Heart className="h-6 w-6" />;
    case "Policies":
      return <Shield className="h-6 w-6" />;
    case "Time Off":
      return <Calendar className="h-6 w-6" />;
    case "Remote Work":
      return <MapPin className="h-6 w-6" />;
    case "Development":
      return <Zap className="h-6 w-6" />;
    case "Recognition":
      return <Award className="h-6 w-6" />;
    default:
      return <Users className="h-6 w-6" />;
  }
};

export default function StaffTeamHandbook() {
  const { session } = useAuth();
  const [sections, setSections] = useState<HandbookSection[]>([]);
  const [grouped, setGrouped] = useState<Record<string, HandbookSection[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.access_token) {
      fetchHandbook();
    }
  }, [session?.access_token]);

  const fetchHandbook = async () => {
    try {
      const res = await fetch("/api/staff/handbook", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSections(data.sections || []);
        setGrouped(data.grouped || {});
        setCategories(data.categories || []);
      }
    } catch (err) {
      aethexToast.error("Failed to load handbook");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      </Layout>
    );
  }

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

            {/* Handbook Sections by Category */}
            <div className="space-y-6">
              {categories.map((category) => (
                <Card
                  key={category}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                          {getCategoryIcon(category)}
                        </div>
                        <div>
                          <CardTitle className="text-blue-100">
                            {category}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            {grouped[category]?.length || 0} sections
                          </CardDescription>
                        </div>
                      </div>
                      {expandedCategory === category ? (
                        <ChevronUp className="h-5 w-5 text-blue-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedCategory === category && (
                    <CardContent className="pt-0">
                      <div className="space-y-4 pl-14">
                        {grouped[category]?.map((section) => (
                          <div
                            key={section.id}
                            className="p-4 bg-slate-700/30 rounded-lg"
                          >
                            <h4 className="font-semibold text-blue-100 mb-2">
                              {section.title}
                            </h4>
                            <p className="text-slate-300 text-sm whitespace-pre-line">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No handbook sections found</p>
              </div>
            )}

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
