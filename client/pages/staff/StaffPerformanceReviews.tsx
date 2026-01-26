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
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  Award,
  Users,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  id: string;
  period: string;
  status: string;
  overall_rating?: number;
  reviewer_comments?: string;
  employee_comments?: string;
  goals_met?: number;
  goals_total?: number;
  due_date: string;
  created_at: string;
  reviewer?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  completed: number;
  average_rating: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "in_progress":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "pending":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function StaffPerformanceReviews() {
  const { session } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, completed: 0, average_rating: 0 });
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentDialog, setCommentDialog] = useState<Review | null>(null);
  const [employeeComments, setEmployeeComments] = useState("");

  useEffect(() => {
    if (session?.access_token) {
      fetchReviews();
    }
  }, [session?.access_token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/staff/reviews", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, pending: 0, completed: 0, average_rating: 0 });
      }
    } catch (err) {
      aethexToast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const submitComments = async () => {
    if (!commentDialog) return;
    try {
      const res = await fetch("/api/staff/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          review_id: commentDialog.id,
          employee_comments: employeeComments,
        }),
      });
      if (res.ok) {
        aethexToast.success("Comments submitted");
        setCommentDialog(null);
        setEmployeeComments("");
        fetchReviews();
      }
    } catch (err) {
      aethexToast.error("Failed to submit comments");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Performance Reviews"
        description="Personal performance reviews and 360 feedback"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-purple-100">
                  Performance Reviews
                </h1>
                <p className="text-purple-200/70">
                  360 feedback, self-assessments, and performance metrics
                </p>
              </div>
            </div>

            {/* Overall Score */}
            <Card className="bg-purple-950/30 border-purple-500/30 mb-12">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-purple-200/70 mb-2">
                      Average Rating
                    </p>
                    <p className="text-5xl font-bold text-purple-100 mb-4">
                      {stats.average_rating.toFixed(1)}
                    </p>
                    <p className="text-slate-400">
                      Based on {stats.completed} completed reviews
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Award className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-sm text-purple-200/70">
                        {stats.average_rating >= 4 ? "Exceeds Expectations" : stats.average_rating >= 3 ? "Meets Expectations" : "Needs Improvement"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-purple-950/30 border-purple-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-purple-100">{stats.total}</p>
                  <p className="text-sm text-purple-200/70">Total Reviews</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-950/30 border-purple-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-purple-100">{stats.pending}</p>
                  <p className="text-sm text-purple-200/70">Pending</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-950/30 border-purple-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-purple-100">{stats.completed}</p>
                  <p className="text-sm text-purple-200/70">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Review History */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-purple-100 mb-6">
                Review History
              </h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() =>
                      setSelectedReview(
                        selectedReview === review.id ? null : review.id,
                      )
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-purple-100">
                            {review.period} Review
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Due: {new Date(review.due_date).toLocaleDateString()}
                            {review.reviewer && ` • Reviewer: ${review.reviewer.full_name}`}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`border ${getStatusColor(review.status)}`}
                        >
                          {review.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                    </CardHeader>
                    {selectedReview === review.id && (
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          {review.overall_rating && (
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                              <Award className="h-5 w-5 text-purple-400" />
                              <div>
                                <p className="text-sm text-slate-300">Rating</p>
                                <p className="text-sm text-purple-300">
                                  {review.overall_rating}/5
                                </p>
                              </div>
                            </div>
                          )}
                          {review.goals_total && (
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                              <CheckCircle className="h-5 w-5 text-purple-400" />
                              <div>
                                <p className="text-sm text-slate-300">Goals Met</p>
                                <p className="text-sm text-purple-300">
                                  {review.goals_met}/{review.goals_total}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                            <MessageSquare className="h-5 w-5 text-purple-400" />
                            <div>
                              <p className="text-sm text-slate-300">Your Comments</p>
                              <p className="text-sm text-purple-300">
                                {review.employee_comments ? "Submitted" : "Not submitted"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {review.reviewer_comments && (
                          <div className="p-4 bg-slate-700/30 rounded">
                            <p className="text-sm text-slate-400 mb-2">Reviewer Comments:</p>
                            <p className="text-slate-200">{review.reviewer_comments}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCommentDialog(review);
                              setEmployeeComments(review.employee_comments || "");
                            }}
                          >
                            {review.employee_comments ? "Edit Comments" : "Add Comments"}
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No reviews found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Dialog */}
      <Dialog open={!!commentDialog} onOpenChange={() => setCommentDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-purple-100">
              {commentDialog?.period} Review Comments
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add your comments about this review..."
              value={employeeComments}
              onChange={(e) => setEmployeeComments(e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-100 min-h-[150px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCommentDialog(null)}>
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={submitComments}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
