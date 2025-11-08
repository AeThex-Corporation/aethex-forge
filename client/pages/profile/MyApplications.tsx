import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { getMyApplications, withdrawApplication } from "@/api/applications";
import { useNavigate } from "react-router-dom";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import type { Application } from "@/api/applications";

export default function MyApplications() {
  const navigate = useNavigate();
  const { toast } = useAethexToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const result = await getMyApplications({
          status: selectedStatus,
          page: 1,
          limit: 50,
        });
        setApplications(result.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [selectedStatus]);

  const handleWithdraw = async (applicationId: string) => {
    try {
      await withdrawApplication(applicationId);
      toast("Application withdrawn", "success");
      setApplications(applications.filter((app) => app.id !== applicationId));
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to withdraw application",
        "error",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500/10 text-blue-300";
      case "reviewing":
        return "bg-yellow-500/10 text-yellow-300";
      case "accepted":
        return "bg-green-500/10 text-green-300";
      case "rejected":
        return "bg-red-500/10 text-red-300";
      default:
        return "bg-gray-500/10 text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "reviewing":
        return <FileText className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#8b5cf6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(139,92,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-white mb-2">
                My Applications
              </h1>
              <p className="text-gray-300">
                Track the status of all your job applications
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : applications.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No applications yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start applying to opportunities to see them here
                  </p>
                  <Button onClick={() => navigate("/opportunities")}>
                    Browse Opportunities
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Tabs
                  value={selectedStatus || "all"}
                  onValueChange={(value) =>
                    setSelectedStatus(value === "all" ? undefined : value)
                  }
                  className="mb-8"
                >
                  <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
                    <TabsTrigger value="all">
                      All ({applications.length})
                    </TabsTrigger>
                    <TabsTrigger value="submitted">
                      Submitted (
                      {
                        applications.filter((app) => app.status === "submitted")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="reviewing">
                      Reviewing (
                      {
                        applications.filter((app) => app.status === "reviewing")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="accepted">
                      Accepted (
                      {
                        applications.filter((app) => app.status === "accepted")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected (
                      {
                        applications.filter((app) => app.status === "rejected")
                          .length
                      }
                      )
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {applications.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        statusColor={getStatusColor(app.status)}
                        statusIcon={getStatusIcon(app.status)}
                        onWithdraw={handleWithdraw}
                        onViewOpportunity={() =>
                          navigate(`/opportunities/${app.opportunity_id}`)
                        }
                      />
                    ))}
                  </TabsContent>

                  {["submitted", "reviewing", "accepted", "rejected"].map(
                    (status) => (
                      <TabsContent
                        key={status}
                        value={status}
                        className="space-y-4"
                      >
                        {applications
                          .filter((app) => app.status === status)
                          .map((app) => (
                            <ApplicationCard
                              key={app.id}
                              application={app}
                              statusColor={getStatusColor(app.status)}
                              statusIcon={getStatusIcon(app.status)}
                              onWithdraw={handleWithdraw}
                              onViewOpportunity={() =>
                                navigate(`/opportunities/${app.opportunity_id}`)
                              }
                            />
                          ))}
                      </TabsContent>
                    ),
                  )}
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

interface ApplicationCardProps {
  application: Application;
  statusColor: string;
  statusIcon: React.ReactNode;
  onWithdraw: (id: string) => void;
  onViewOpportunity: () => void;
}

function ApplicationCard({
  application,
  statusColor,
  statusIcon,
  onWithdraw,
  onViewOpportunity,
}: ApplicationCardProps) {
  const opportunity = application.aethex_opportunities;
  if (!opportunity) return null;

  const poster = opportunity.aethex_creators;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-white">
                {opportunity.title}
              </h3>
              <Badge className={`${statusColor} border-0 gap-1`}>
                {statusIcon}
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={poster.avatar_url} alt={poster.username} />
                <AvatarFallback>
                  {poster.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-400">Posted by</p>
                <p className="font-semibold">@{poster.username}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-3">
              Applied on {new Date(application.applied_at).toLocaleDateString()}
            </p>

            {application.response_message && (
              <p className="text-sm bg-slate-700/30 text-gray-300 p-3 rounded-lg mb-3 italic">
                {application.response_message}
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Button
              onClick={onViewOpportunity}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Opportunity
            </Button>
            {application.status === "submitted" && (
              <Button
                onClick={() => onWithdraw(application.id)}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
