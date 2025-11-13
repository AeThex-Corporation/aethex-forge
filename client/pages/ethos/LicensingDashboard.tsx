import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

interface LicensingAgreement {
  id: string;
  track_id: string;
  licensee_id: string;
  license_type: string;
  agreement_url?: string;
  approved: boolean;
  created_at: string;
  expires_at?: string;
  ethos_tracks?: {
    title: string;
    user_id: string;
  };
  user_profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function LicensingDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useAethexToast();

  const [agreements, setAgreements] = useState<LicensingAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAgreements = async () => {
      try {
        const status = activeTab === "all" ? "all" : activeTab;
        const res = await fetch(
          `${API_BASE}/api/ethos/licensing-agreements?status=${status}`,
          {
            headers: { "x-user-id": user.id },
          },
        );

        if (res.ok) {
          const { data } = await res.json();
          setAgreements(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch agreements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, [user, navigate, activeTab]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/ethos/licensing-agreements?id=${id}`,
        {
          method: "PUT",
          headers: {
            "x-user-id": user!.id,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approved: true }),
        },
      );

      if (res.ok) {
        setAgreements((prev) =>
          prev.map((a) => (a.id === id ? { ...a, approved: true } : a)),
        );
        toast.success({
          title: "Agreement approved",
          description: "The licensing agreement has been approved",
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: String(error),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agreement?")) return;

    try {
      await fetch(`${API_BASE}/api/ethos/licensing-agreements?id=${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user!.id },
      });

      setAgreements((prev) => prev.filter((a) => a.id !== id));
      toast.success({
        title: "Agreement deleted",
      });
    } catch (error) {
      toast.error({
        title: "Error",
        description: String(error),
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center">Loading agreements...</div>
      </Layout>
    );
  }

  const pendingCount = agreements.filter((a) => !a.approved).length;
  const approvedCount = agreements.filter((a) => a.approved).length;

  return (
    <>
      <SEO pageTitle="Licensing Dashboard - Ethos Guild" />
      <Layout>
        <div className="bg-slate-950 text-foreground min-h-screen">
          <div className="container mx-auto px-4 max-w-4xl py-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8" />
                Licensing Agreements
              </h1>
              <p className="text-slate-400">
                Manage commercial licensing requests for your tracks
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-xs uppercase mb-2">
                    Total Agreements
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {agreements.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-xs uppercase mb-2">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {pendingCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-xs uppercase mb-2">
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {approvedCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-xs uppercase mb-2">
                    Potential Revenue
                  </p>
                  <p className="text-2xl font-bold text-white">Coming</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-900 border-slate-800">
                <TabsTrigger value="pending">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedCount})
                </TabsTrigger>
                <TabsTrigger value="all">All Agreements</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4 mt-6">
                {agreements.filter((a) => !a.approved).length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="py-12 text-center text-slate-400">
                      No pending licensing requests
                    </CardContent>
                  </Card>
                ) : (
                  agreements
                    .filter((a) => !a.approved)
                    .map((agreement) => (
                      <AgreementCard
                        key={agreement.id}
                        agreement={agreement}
                        onApprove={() => handleApprove(agreement.id)}
                        onDelete={() => handleDelete(agreement.id)}
                      />
                    ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4 mt-6">
                {agreements.filter((a) => a.approved).length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="py-12 text-center text-slate-400">
                      No approved agreements yet
                    </CardContent>
                  </Card>
                ) : (
                  agreements
                    .filter((a) => a.approved)
                    .map((agreement) => (
                      <AgreementCard
                        key={agreement.id}
                        agreement={agreement}
                        onDelete={() => handleDelete(agreement.id)}
                      />
                    ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4 mt-6">
                {agreements.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="py-12 text-center text-slate-400">
                      No licensing agreements yet
                    </CardContent>
                  </Card>
                ) : (
                  agreements.map((agreement) => (
                    <AgreementCard
                      key={agreement.id}
                      agreement={agreement}
                      onApprove={
                        !agreement.approved
                          ? () => handleApprove(agreement.id)
                          : undefined
                      }
                      onDelete={() => handleDelete(agreement.id)}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </>
  );
}

interface AgreementCardProps {
  agreement: LicensingAgreement;
  onApprove?: () => void;
  onDelete: () => void;
}

function AgreementCard({ agreement, onApprove, onDelete }: AgreementCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const licenseTypeLabel =
    {
      commercial_one_time: "One-time License",
      commercial_exclusive: "Exclusive License",
      broadcast: "Broadcast License",
    }[agreement.license_type] || agreement.license_type;

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {agreement.ethos_tracks?.title || "Unknown Track"}
              </h3>
              {agreement.approved ? (
                <Badge className="bg-green-500/10 border-green-500/30 text-green-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-3">
              Licensed by:{" "}
              <span className="text-slate-300">
                {agreement.user_profiles?.full_name || "Unknown"}
              </span>
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-slate-500">License Type</p>
                <p className="text-white">{licenseTypeLabel}</p>
              </div>
              <div>
                <p className="text-slate-500">Requested</p>
                <p className="text-white">{formatDate(agreement.created_at)}</p>
              </div>
              {agreement.expires_at && (
                <div>
                  <p className="text-slate-500">Expires</p>
                  <p className="text-white">
                    {formatDate(agreement.expires_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {agreement.agreement_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-slate-700"
            >
              <a
                href={agreement.agreement_url}
                target="_blank"
                rel="noreferrer"
              >
                View Contract
              </a>
            </Button>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-800">
          {onApprove && (
            <Button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              size="sm"
            >
              Approve Agreement
            </Button>
          )}
          <Button
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="border-slate-700 hover:bg-slate-800"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
