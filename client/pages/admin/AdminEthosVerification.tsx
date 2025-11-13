import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Clock, ChevronRight, Music } from "lucide-react";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

interface VerificationRequest {
  id: string;
  user_id: string;
  artist_profile_id: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
  submission_notes?: string;
  portfolio_links?: string[];
  user_profiles?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  ethos_artist_profiles?: {
    bio: string;
    skills: string[];
    for_hire: boolean;
    sample_price_track?: number;
  };
}

export default function AdminEthosVerification() {
  const { user } = useAuth();
  const toast = useAethexToast();

  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/ethos/verification?status=${activeTab}`,
        {
          headers: {
            "x-user-id": user?.id || "",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch requests");

      const { data } = await response.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setConfirmAction("approve");
    setIsConfirming(true);
  };

  const handleReject = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setConfirmAction("reject");
    setRejectionReason("");
    setIsConfirming(true);
  };

  const confirmDecision = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(`${API_BASE}/api/ethos/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          action: confirmAction,
          request_id: selectedRequest.id,
          rejection_reason: rejectionReason,
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${confirmAction} artist`);

      toast.success(
        confirmAction === "approve"
          ? "Artist verified successfully! Email sent."
          : "Artist application rejected. Email sent.",
      );

      setIsConfirming(false);
      setSelectedRequest(null);
      setConfirmAction(null);
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${confirmAction} artist`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Music className="w-8 h-8 text-pink-500" />
          Ethos Guild Artist Verification
        </h1>
        <p className="text-gray-400">
          Manage artist verification applications and approve verified creators
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {stats.pending}
            </div>
            <p className="text-sm text-gray-400">
              Applications awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {stats.approved}
            </div>
            <p className="text-sm text-gray-400">Verified artists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {stats.rejected}
            </div>
            <p className="text-sm text-gray-400">Declined applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>
            Review and approve artist applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({stats.rejected})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  Loading requests...
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No {activeTab} verification requests
                </div>
              ) : (
                requests.map((request) => (
                  <VerificationRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getStatusIcon={getStatusIcon}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {confirmAction === "approve" ? "Verify Artist?" : "Reject Artist?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirmAction === "approve"
              ? `Verify ${selectedRequest?.user_profiles?.full_name} as an Ethos Guild artist? They will be notified by email and can start uploading tracks.`
              : `Reject ${selectedRequest?.user_profiles?.full_name}'s application? They will be notified by email.`}
          </AlertDialogDescription>

          {confirmAction === "reject" && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Rejection Reason (optional)
              </label>
              <Textarea
                placeholder="Provide feedback to help them improve their application..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="h-32"
              />
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDecision}
              className={
                confirmAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmAction === "approve" ? "Verify" : "Reject"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VerificationRequestCard({
  request,
  onApprove,
  onReject,
  getStatusIcon,
}: {
  request: VerificationRequest;
  onApprove: (req: VerificationRequest) => void;
  onReject: (req: VerificationRequest) => void;
  getStatusIcon: (status: string) => JSX.Element;
}) {
  const submittedDate = new Date(request.submitted_at).toLocaleDateString();
  const skills = request.ethos_artist_profiles?.skills || [];
  const isoDate = new Date(request.submitted_at);
  const formattedDate = isoDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-slate-700 rounded-lg p-4 hover:bg-slate-900/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {request.user_profiles?.avatar_url && (
            <img
              src={request.user_profiles.avatar_url}
              alt={request.user_profiles.full_name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">
                {request.user_profiles?.full_name}
              </h3>
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                {getStatusIcon(request.status)}
                {request.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">
              {request.user_profiles?.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Applied: {formattedDate}
            </p>
          </div>
        </div>

        {request.status === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={() => onReject(request)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onApprove(request)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Verify
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {request.ethos_artist_profiles?.bio && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">Bio</p>
            <p className="text-sm text-gray-300">
              {request.ethos_artist_profiles.bio}
            </p>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {request.submission_notes && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">
              Application Notes
            </p>
            <p className="text-sm text-gray-300">{request.submission_notes}</p>
          </div>
        )}

        {request.portfolio_links && request.portfolio_links.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">
              Portfolio Links
            </p>
            <div className="flex flex-wrap gap-2">
              {request.portfolio_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  Portfolio {idx + 1}
                  <ChevronRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {request.rejection_reason && request.status === "rejected" && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded">
            <p className="text-xs font-medium text-red-400 mb-1">
              Rejection Reason
            </p>
            <p className="text-sm text-red-300">{request.rejection_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
