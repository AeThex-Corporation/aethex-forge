import { supabase } from "../_supabase.js";

interface ChecklistItem {
  id: string;
  checklist_item: string;
  phase: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

interface OnboardingMetadata {
  start_date: string;
  manager_id: string | null;
  department: string | null;
  role_title: string | null;
  onboarding_completed: boolean;
}

// Default checklist items for new staff
const DEFAULT_CHECKLIST_ITEMS = [
  // Day 1
  { item: "Complete HR paperwork", phase: "day1" },
  { item: "Set up workstation", phase: "day1" },
  { item: "Join Discord server", phase: "day1" },
  { item: "Meet your manager", phase: "day1" },
  { item: "Review company handbook", phase: "day1" },
  { item: "Set up email and accounts", phase: "day1" },
  // Week 1
  { item: "Complete security training", phase: "week1" },
  { item: "Set up development environment", phase: "week1" },
  { item: "Review codebase architecture", phase: "week1" },
  { item: "Attend team standup", phase: "week1" },
  { item: "Complete first small task", phase: "week1" },
  { item: "Meet team members", phase: "week1" },
  // Month 1
  { item: "Complete onboarding course", phase: "month1" },
  { item: "Contribute to first sprint", phase: "month1" },
  { item: "30-day check-in with manager", phase: "month1" },
  { item: "Set Q1 OKRs", phase: "month1" },
  { item: "Shadow a senior team member", phase: "month1" },
];

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = userData.user.id;
  const url = new URL(req.url);

  try {
    // GET - Fetch onboarding progress
    if (req.method === "GET") {
      // Check for admin view (managers viewing team progress)
      if (url.pathname.endsWith("/admin")) {
        // Get team members for this manager
        const { data: teamMembers, error: teamError } = await supabase
          .from("staff_members")
          .select("user_id, full_name, email, avatar_url, start_date")
          .eq("manager_id", userId);

        if (teamError) {
          return new Response(JSON.stringify({ error: teamError.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!teamMembers || teamMembers.length === 0) {
          return new Response(JSON.stringify({ team: [] }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        // Get progress for all team members
        const userIds = teamMembers.map((m) => m.user_id);
        const { data: progressData } = await supabase
          .from("staff_onboarding_progress")
          .select("*")
          .in("user_id", userIds);

        // Calculate completion for each team member
        const teamProgress = teamMembers.map((member) => {
          const memberProgress = progressData?.filter(
            (p) => p.user_id === member.user_id,
          );
          const completed =
            memberProgress?.filter((p) => p.completed).length || 0;
          const total = DEFAULT_CHECKLIST_ITEMS.length;
          return {
            ...member,
            progress_completed: completed,
            progress_total: total,
            progress_percentage: Math.round((completed / total) * 100),
          };
        });

        return new Response(JSON.stringify({ team: teamProgress }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Regular user view - get own progress
      const { data: progress, error: progressError } = await supabase
        .from("staff_onboarding_progress")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      // Get or create metadata
      let { data: metadata, error: metadataError } = await supabase
        .from("staff_onboarding_metadata")
        .select("*")
        .eq("user_id", userId)
        .single();

      // If no metadata exists, create it
      if (!metadata && metadataError?.code === "PGRST116") {
        const { data: newMetadata } = await supabase
          .from("staff_onboarding_metadata")
          .insert({ user_id: userId })
          .select()
          .single();
        metadata = newMetadata;
      }

      // Get staff member info for name/department
      const { data: staffMember } = await supabase
        .from("staff_members")
        .select("full_name, department, role, avatar_url")
        .eq("user_id", userId)
        .single();

      // Get manager info if exists
      let managerInfo = null;
      if (metadata?.manager_id) {
        const { data: manager } = await supabase
          .from("staff_members")
          .select("full_name, email, avatar_url")
          .eq("user_id", metadata.manager_id)
          .single();
        managerInfo = manager;
      }

      // If no progress exists, initialize with default items
      let progressItems = progress || [];
      if (!progress || progress.length === 0) {
        const itemsToInsert = DEFAULT_CHECKLIST_ITEMS.map((item) => ({
          user_id: userId,
          checklist_item: item.item,
          phase: item.phase,
          completed: false,
        }));

        const { data: insertedItems } = await supabase
          .from("staff_onboarding_progress")
          .insert(itemsToInsert)
          .select();

        progressItems = insertedItems || [];
      }

      // Group by phase
      const groupedProgress = {
        day1: progressItems.filter((p) => p.phase === "day1"),
        week1: progressItems.filter((p) => p.phase === "week1"),
        month1: progressItems.filter((p) => p.phase === "month1"),
      };

      // Calculate overall progress
      const completed = progressItems.filter((p) => p.completed).length;
      const total = progressItems.length;

      return new Response(
        JSON.stringify({
          progress: groupedProgress,
          metadata: metadata || { start_date: new Date().toISOString() },
          staff_member: staffMember,
          manager: managerInfo,
          summary: {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // POST - Mark item complete/incomplete
    if (req.method === "POST") {
      const body = await req.json();
      const { checklist_item, completed, notes } = body;

      if (!checklist_item) {
        return new Response(
          JSON.stringify({ error: "checklist_item is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Upsert the progress item
      const { data, error } = await supabase
        .from("staff_onboarding_progress")
        .upsert(
          {
            user_id: userId,
            checklist_item,
            phase:
              DEFAULT_CHECKLIST_ITEMS.find((i) => i.item === checklist_item)
                ?.phase || "day1",
            completed: completed ?? true,
            completed_at: completed ? new Date().toISOString() : null,
            notes: notes || null,
          },
          {
            onConflict: "user_id,checklist_item",
          },
        )
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check if all items are complete
      const { data: allProgress } = await supabase
        .from("staff_onboarding_progress")
        .select("completed")
        .eq("user_id", userId);

      const allCompleted = allProgress?.every((p) => p.completed);

      // Update metadata if all completed
      if (allCompleted) {
        await supabase
          .from("staff_onboarding_metadata")
          .update({
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }

      return new Response(
        JSON.stringify({
          item: data,
          all_completed: allCompleted,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Onboarding API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
