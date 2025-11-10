import { useState } from "react";
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
} from "lucide-react";

interface Review {
  id: string;
  period: string;
  status: "Pending" | "In Progress" | "Completed";
  reviewer?: string;
  dueDate: string;
  feedback?: number;
  selfAssessment?: boolean;
}

interface Metric {
  name: string;
  score: number;
  lastQuarter: number;
}

const userReviews: Review[] = [
  {
    id: "1",
    period: "Q1 2025",
    status: "In Progress",
    dueDate: "March 31, 2025",
    selfAssessment: true,
    feedback: 3,
  },
  {
    id: "2",
    period: "Q4 2024",
    status: "Completed",
    dueDate: "December 31, 2024",
    selfAssessment: true,
    feedback: 5,
  },
  {
    id: "3",
    period: "Q3 2024",
    status: "Completed",
    dueDate: "September 30, 2024",
    selfAssessment: true,
    feedback: 4,
  },
];

const performanceMetrics: Metric[] = [
  {
    name: "Technical Skills",
    score: 8.5,
    lastQuarter: 8.2,
  },
  {
    name: "Communication",
    score: 8.8,
    lastQuarter: 8.5,
  },
  {
    name: "Collaboration",
    score: 9.0,
    lastQuarter: 8.7,
  },
  {
    name: "Leadership",
    score: 8.2,
    lastQuarter: 7.9,
  },
  {
    name: "Problem Solving",
    score: 8.7,
    lastQuarter: 8.4,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "In Progress":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Pending":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function StaffPerformanceReviews() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const avgScore =
    Math.round(
      (performanceMetrics.reduce((sum, m) => sum + m.score, 0) /
        performanceMetrics.length) *
        10,
    ) / 10;

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
                      Overall Rating
                    </p>
                    <p className="text-5xl font-bold text-purple-100 mb-4">
                      {avgScore}
                    </p>
                    <p className="text-slate-400">
                      Based on 5 performance dimensions
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Award className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-sm text-purple-200/70">
                        Exceeds Expectations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-purple-100 mb-6">
                Performance Dimensions
              </h2>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <Card
                    key={metric.name}
                    className="bg-slate-800/50 border-slate-700/50"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-purple-100">
                            {metric.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            Last quarter: {metric.lastQuarter}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-purple-300">
                          {metric.score}
                        </p>
                      </div>
                      <Progress
                        value={(metric.score / 10) * 100}
                        className="h-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Review History */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-purple-100 mb-6">
                Review History
              </h2>
              <div className="space-y-4">
                {userReviews.map((review) => (
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
                            Due: {review.dueDate}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`border ${getStatusColor(review.status)}`}
                        >
                          {review.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    {selectedReview === review.id && (
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          {review.selfAssessment && (
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                              <MessageSquare className="h-5 w-5 text-purple-400" />
                              <div>
                                <p className="text-sm text-slate-300">
                                  Self Assessment
                                </p>
                                <p className="text-sm text-purple-300">
                                  Completed
                                </p>
                              </div>
                            </div>
                          )}
                          {review.feedback && (
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                              <Users className="h-5 w-5 text-purple-400" />
                              <div>
                                <p className="text-sm text-slate-300">
                                  360 Feedback
                                </p>
                                <p className="text-sm text-purple-300">
                                  {review.feedback} responses
                                </p>
                              </div>
                            </div>
                          )}
                          {review.status === "Completed" && (
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <div>
                                <p className="text-sm text-slate-300">
                                  Manager Review
                                </p>
                                <p className="text-sm text-green-300">
                                  Completed
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          View Full Review
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-100">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-purple-100">
                      Complete Q1 Self Assessment
                    </p>
                    <p className="text-sm text-slate-400">
                      Due by March 31, 2025
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-purple-100">
                      Schedule 1:1 with Manager
                    </p>
                    <p className="text-sm text-slate-400">
                      Discuss Q1 progress and goals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
