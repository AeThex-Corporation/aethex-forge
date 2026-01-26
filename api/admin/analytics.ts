import { supabase } from "../_supabase.js";

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "30"; // days

  try {
    if (req.method === "GET") {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));

      // Get total users and growth
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: newUsersThisPeriod } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", daysAgo.toISOString());

      // Get active users (logged in within period)
      const { count: activeUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_login_at", daysAgo.toISOString());

      // Get opportunities stats
      const { count: totalOpportunities } = await supabase
        .from("aethex_opportunities")
        .select("*", { count: "exact", head: true });

      const { count: openOpportunities } = await supabase
        .from("aethex_opportunities")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      const { count: newOpportunities } = await supabase
        .from("aethex_opportunities")
        .select("*", { count: "exact", head: true })
        .gte("created_at", daysAgo.toISOString());

      // Get applications stats
      const { count: totalApplications } = await supabase
        .from("aethex_applications")
        .select("*", { count: "exact", head: true });

      const { count: newApplications } = await supabase
        .from("aethex_applications")
        .select("*", { count: "exact", head: true })
        .gte("created_at", daysAgo.toISOString());

      // Get contracts stats
      const { count: totalContracts } = await supabase
        .from("nexus_contracts")
        .select("*", { count: "exact", head: true });

      const { count: activeContracts } = await supabase
        .from("nexus_contracts")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Get community stats
      const { count: totalPosts } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true });

      const { count: newPosts } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", daysAgo.toISOString());

      // Get creator stats
      const { count: totalCreators } = await supabase
        .from("aethex_creators")
        .select("*", { count: "exact", head: true });

      // Get daily signups for trend (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: signupTrend } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at");

      // Group signups by date
      const signupsByDate: Record<string, number> = {};
      signupTrend?.forEach((user) => {
        const date = new Date(user.created_at).toISOString().split("T")[0];
        signupsByDate[date] = (signupsByDate[date] || 0) + 1;
      });

      const dailySignups = Object.entries(signupsByDate).map(([date, count]) => ({
        date,
        count
      }));

      // Revenue data (if available)
      const { data: revenueData } = await supabase
        .from("nexus_payments")
        .select("amount, created_at")
        .eq("status", "completed")
        .gte("created_at", daysAgo.toISOString());

      const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Top performing opportunities
      const { data: topOpportunities } = await supabase
        .from("aethex_opportunities")
        .select(`
          id,
          title,
          aethex_applications(count)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);

      return new Response(JSON.stringify({
        users: {
          total: totalUsers || 0,
          new: newUsersThisPeriod || 0,
          active: activeUsers || 0,
          creators: totalCreators || 0
        },
        opportunities: {
          total: totalOpportunities || 0,
          open: openOpportunities || 0,
          new: newOpportunities || 0
        },
        applications: {
          total: totalApplications || 0,
          new: newApplications || 0
        },
        contracts: {
          total: totalContracts || 0,
          active: activeContracts || 0
        },
        community: {
          posts: totalPosts || 0,
          newPosts: newPosts || 0
        },
        revenue: {
          total: totalRevenue,
          period: `${period} days`
        },
        trends: {
          dailySignups,
          topOpportunities: topOpportunities?.map(o => ({
            id: o.id,
            title: o.title,
            applications: o.aethex_applications?.[0]?.count || 0
          })) || []
        },
        period: parseInt(period)
      }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("Analytics API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
