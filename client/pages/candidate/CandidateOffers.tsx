import { useState, useEffect } from "react";
import { Link } from "wouter";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Gift,
  ArrowLeft,
  DollarSign,
  Calendar,
  Building,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Offer {
  id: string;
  position_title: string;
  company_name: string;
  salary_amount: number | null;
  salary_type: string | null;
  start_date: string | null;
  offer_expiry: string | null;
  benefits: any[];
  offer_letter_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  employer: {
    full_name: string;
    avatar_url: string | null;
    email: string;
  } | null;
}

interface GroupedOffers {
  pending: Offer[];
  accepted: Offer[];
  declined: Offer[];
  expired: Offer[];
  withdrawn: Offer[];
}

export default function CandidateOffers() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [grouped, setGrouped] = useState<GroupedOffers>({
    pending: [],
    accepted: [],
    declined: [],
    expired: [],
    withdrawn: [],
  });
  const [filter, setFilter] = useState("all");
  const [respondingTo, setRespondingTo] = useState<Offer | null>(null);
  const [responseAction, setResponseAction] = useState<"accept" | "decline" | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.access_token) {
      fetchOffers();
    }
  }, [session?.access_token]);

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/candidate/offers", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
        setGrouped(
          data.grouped || {
            pending: [],
            accepted: [],
            declined: [],
            expired: [],
            withdrawn: [],
          },
        );
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      aethexToast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const respondToOffer = async () => {
    if (!respondingTo || !responseAction || !session?.access_token) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/candidate/offers", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: respondingTo.id,
          status: responseAction === "accept" ? "accepted" : "declined",
          notes: responseNotes,
        }),
      });

      if (!response.ok) throw new Error("Failed to respond to offer");

      aethexToast.success(
        responseAction === "accept"
          ? "Congratulations! You've accepted the offer."
          : "Offer declined",
      );

      // Refresh offers
      await fetchOffers();

      // Close dialog
      setRespondingTo(null);
      setResponseAction(null);
      setResponseNotes("");
    } catch (error) {
      console.error("Error responding to offer:", error);
      aethexToast.error("Failed to respond to offer");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSalary = (amount: number | null, type: string | null) => {
    if (!amount) return "Not specified";
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
    const suffix =
      type === "hourly" ? "/hr" : type === "monthly" ? "/mo" : "/yr";
    return formatted + suffix;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            Expired
          </Badge>
        );
      case "withdrawn":
        return (
          <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">
            Withdrawn
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysUntilExpiry = (expiry: string | null) => {
    if (!expiry) return null;
    const diff = new Date(expiry).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getFilteredOffers = () => {
    switch (filter) {
      case "pending":
        return grouped.pending;
      case "accepted":
        return grouped.accepted;
      case "declined":
        return grouped.declined;
      case "expired":
        return grouped.expired;
      default:
        return offers;
    }
  };

  if (loading) {
    return (
      <Layout>
        <SEO title="Job Offers" description="Review and respond to job offers" />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      </Layout>
    );
  }

  const filteredOffers = getFilteredOffers();

  return (
    <Layout>
      <SEO title="Job Offers" description="Review and respond to job offers" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            {/* Header */}
            <div className="mb-8">
              <Link href="/candidate">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-300 hover:text-violet-200 hover:bg-violet-500/10 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <Gift className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-violet-100">
                    Job Offers
                  </h1>
                  <p className="text-violet-200/70">
                    Review and respond to offers
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      {grouped.pending.length}
                    </p>
                    <p className="text-sm text-slate-400">Pending</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {grouped.accepted.length}
                    </p>
                    <p className="text-sm text-slate-400">Accepted</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-red-400">
                      {grouped.declined.length}
                    </p>
                    <p className="text-sm text-slate-400">Declined</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-slate-400">
                      {offers.length}
                    </p>
                    <p className="text-sm text-slate-400">Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filter */}
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Filter offers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offers</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Offers List */}
            <div className="space-y-4">
              {filteredOffers.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Gift className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">
                      No offers found
                    </p>
                    <p className="text-slate-500 text-sm">
                      {filter === "all"
                        ? "You don't have any job offers yet"
                        : `No ${filter} offers`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredOffers.map((offer) => {
                  const daysUntilExpiry = getDaysUntilExpiry(offer.offer_expiry);
                  const isExpiringSoon =
                    daysUntilExpiry !== null &&
                    daysUntilExpiry > 0 &&
                    daysUntilExpiry <= 3;

                  return (
                    <Card
                      key={offer.id}
                      className={`bg-slate-800/50 border-slate-700/50 hover:border-violet-500/30 transition-all ${
                        offer.status === "pending" && isExpiringSoon
                          ? "border-yellow-500/50"
                          : ""
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-violet-100">
                                {offer.position_title}
                              </h3>
                              <div className="flex items-center gap-2 text-slate-400 mt-1">
                                <Building className="h-4 w-4" />
                                {offer.company_name}
                              </div>
                            </div>
                            {getStatusBadge(offer.status)}
                          </div>

                          {/* Expiry Warning */}
                          {offer.status === "pending" && isExpiringSoon && (
                            <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm">
                                Expires in {daysUntilExpiry} day
                                {daysUntilExpiry !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <span>
                                {formatSalary(
                                  offer.salary_amount,
                                  offer.salary_type,
                                )}
                              </span>
                            </div>
                            {offer.start_date && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                <span>Start: {formatDate(offer.start_date)}</span>
                              </div>
                            )}
                            {offer.offer_expiry && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <Clock className="h-4 w-4 text-yellow-400" />
                                <span>
                                  Expires: {formatDate(offer.offer_expiry)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Benefits */}
                          {offer.benefits && offer.benefits.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {offer.benefits.map((benefit: string, i: number) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-slate-300 border-slate-600"
                                >
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                            {offer.status === "pending" && (
                              <>
                                <Button
                                  onClick={() => {
                                    setRespondingTo(offer);
                                    setResponseAction("accept");
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Accept Offer
                                </Button>
                                <Button
                                  onClick={() => {
                                    setRespondingTo(offer);
                                    setResponseAction("decline");
                                  }}
                                  variant="outline"
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Decline
                                </Button>
                              </>
                            )}
                            {offer.offer_letter_url && (
                              <a
                                href={offer.offer_letter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="outline"
                                  className="border-violet-500/30 text-violet-300"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Offer Letter
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Response Dialog */}
      <Dialog
        open={!!respondingTo}
        onOpenChange={() => {
          setRespondingTo(null);
          setResponseAction(null);
          setResponseNotes("");
        }}
      >
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-violet-100">
              {responseAction === "accept" ? "Accept Offer" : "Decline Offer"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {responseAction === "accept"
                ? "Congratulations! Please confirm you want to accept this offer."
                : "Are you sure you want to decline this offer? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          {respondingTo && (
            <div className="py-4">
              <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/30 mb-4">
                <p className="font-medium text-violet-100">
                  {respondingTo.position_title}
                </p>
                <p className="text-slate-400">{respondingTo.company_name}</p>
                <p className="text-green-400 mt-2">
                  {formatSalary(
                    respondingTo.salary_amount,
                    respondingTo.salary_type,
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-violet-200">
                  Notes (optional)
                </label>
                <Textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder={
                    responseAction === "accept"
                      ? "Thank you for this opportunity..."
                      : "Reason for declining (optional)..."
                  }
                  className="bg-slate-700/50 border-slate-600 text-slate-100"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRespondingTo(null);
                setResponseAction(null);
                setResponseNotes("");
              }}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={respondToOffer}
              disabled={submitting}
              className={
                responseAction === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : responseAction === "accept" ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {responseAction === "accept" ? "Accept Offer" : "Decline Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
