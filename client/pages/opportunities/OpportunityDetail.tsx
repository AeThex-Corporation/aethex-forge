import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowLeft,
  DollarSign,
  Briefcase,
  Clock,
  Send,
} from "lucide-react";
import { getOpportunityById, getOpportunities } from "@/api/opportunities";
import { submitApplication } from "@/api/applications";
import { ArmBadge } from "@/components/creator-network/ArmBadge";
import { OpportunityCard } from "@/components/creator-network/OpportunityCard";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Opportunity } from "@/api/opportunities";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useAethexToast();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState<
    Opportunity[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getOpportunityById(id);
        setOpportunity(data);

        // Fetch related opportunities (same arm, different from current)
        const relatedResult = await getOpportunities({
          arm: data.arm_affiliation,
          limit: 3,
        });
        setRelatedOpportunities(
          relatedResult.data.filter((opp) => opp.id !== id),
        );
      } catch (error) {
        console.error("Failed to fetch opportunity:", error);
        setOpportunity(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleApply = async () => {
    if (!opportunity || !user) return;

    if (!coverLetter.trim()) {
      toast("Please write a cover letter", "error");
      return;
    }

    setIsApplying(true);
    try {
      await submitApplication({
        opportunity_id: opportunity.id,
        cover_letter: coverLetter.trim(),
      });
      toast("Application submitted successfully!", "success");
      setCoverLetter("");
      setShowApplyDialog(false);
      navigate("/profile/applications");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to submit application",
        "error",
      );
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max)
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Layout>
    );
  }

  if (!opportunity) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Opportunity Not Found</h1>
            <p className="text-gray-400 mb-6">
              The opportunity you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/opportunities")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const poster = opportunity.aethex_creators;

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-12">
            {/* Header */}
            <div className="mb-8">
              <Button
                onClick={() => navigate("/opportunities")}
                variant="ghost"
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
              </Button>
            </div>

            {/* Opportunity Card */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardContent className="p-8">
                <div className="mb-6">
                  <ArmBadge arm={opportunity.arm_affiliation} />
                </div>

                <h1 className="text-4xl font-bold mb-4">{opportunity.title}</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-t border-b border-slate-700">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Job Type</p>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-yellow-400" />
                      <p className="font-semibold">{opportunity.job_type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Salary</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <p className="font-semibold text-sm">
                        {formatSalary(
                          opportunity.salary_min,
                          opportunity.salary_max,
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Experience</p>
                    <p className="font-semibold text-sm">
                      {opportunity.experience_level || "Any"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Posted</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <p className="font-semibold text-sm">
                        {new Date(opportunity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Posted By */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-700/30 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={poster.avatar_url}
                      alt={poster.username}
                    />
                    <AvatarFallback>
                      {poster.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Posted by</p>
                    <p className="font-semibold">@{poster.username}</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/creators/${poster.username}`)}
                    variant="outline"
                  >
                    View Profile
                  </Button>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {opportunity.description}
                  </p>
                </div>

                {/* Apply Button */}
                {user ? (
                  <Button
                    onClick={() => setShowApplyDialog(true)}
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Apply for This Opportunity
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/signup")}
                    size="lg"
                    className="w-full"
                  >
                    Sign in to Apply
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Related Opportunities */}
            {relatedOpportunities.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                  Similar Opportunities in {opportunity.arm_affiliation}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Apply Dialog */}
        <AlertDialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apply for {opportunity.title}</AlertDialogTitle>
              <AlertDialogDescription>
                Submit your application with a cover letter explaining why
                you're interested in this opportunity.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Letter</label>
                <Textarea
                  placeholder="Tell the poster why you're interested in this opportunity..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  disabled={isApplying}
                  className="min-h-32 bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <AlertDialogCancel disabled={isApplying}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApply}
                disabled={isApplying || !coverLetter.trim()}
                className="gap-2"
              >
                {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Application
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
