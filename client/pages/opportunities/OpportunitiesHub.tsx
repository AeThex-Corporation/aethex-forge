import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Briefcase } from "lucide-react";
import { getOpportunities } from "@/api/opportunities";
import { OpportunityCard } from "@/components/creator-network/OpportunityCard";
import { ArmFilter } from "@/components/creator-network/ArmFilter";
import type { Opportunity } from "@/api/opportunities";

export default function OpportunitiesHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedArm, setSelectedArm] = useState<string | undefined>(
    searchParams.get("arm") || undefined,
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        const result = await getOpportunities({
          arm: selectedArm,
          search: search || undefined,
          page,
          limit: 12,
          sort: "recent",
        });
        setOpportunities(result.data);
        setTotalPages(result.pagination.pages);

        // Update URL params
        const params = new URLSearchParams();
        if (selectedArm) params.set("arm", selectedArm);
        if (search) params.set("search", search);
        if (page > 1) params.set("page", String(page));
        setSearchParams(params);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [selectedArm, search, page, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleArmChange = (arm: string | undefined) => {
    setSelectedArm(arm);
    setPage(1);
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-12 lg:py-20 border-b border-slate-800">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                  <Briefcase className="h-8 w-8 text-cyan-400" />
                  <h1 className="text-4xl lg:text-5xl font-black text-white">
                    Opportunities
                  </h1>
                </div>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                  Find jobs, collaborations, and research opportunities across
                  all AeThex arms.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => navigate("/opportunities/post")}
                    className="bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post Opportunity
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search opportunities by title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12 lg:py-20">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <ArmFilter
                      selectedArm={selectedArm}
                      onArmChange={handleArmChange}
                    />
                  </div>
                </div>

                {/* Opportunities Grid */}
                <div className="lg:col-span-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    </div>
                  ) : opportunities.length === 0 ? (
                    <div className="text-center py-20">
                      <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        No opportunities found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your filters or search terms
                      </p>
                      <Button
                        onClick={() => {
                          setSearch("");
                          setSelectedArm(undefined);
                          setPage(1);
                        }}
                        variant="outline"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-6 mb-8">
                        {opportunities.map((opp) => (
                          <OpportunityCard key={opp.id} opportunity={opp} />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                          <Button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            variant="outline"
                          >
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((p) => (
                              <Button
                                key={p}
                                onClick={() => setPage(p)}
                                variant={page === p ? "default" : "outline"}
                                size="sm"
                              >
                                {p}
                              </Button>
                            ))}
                          </div>
                          <Button
                            onClick={() =>
                              setPage(Math.min(totalPages, page + 1))
                            }
                            disabled={page === totalPages}
                            variant="outline"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
