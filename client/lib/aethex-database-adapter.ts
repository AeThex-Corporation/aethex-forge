import { supabase } from "./supabase";
import type { Database } from "./database.types";
import { aethexToast } from "./aethex-toast";
import { mockAuth } from "./mock-auth";

// ... existing content above ...

// Role Services (with Supabase table fallback)
export const aethexRoleService = {
  async getUserRoles(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (!error && Array.isArray(data) && data.length) {
        return (data as any[]).map((r) => (r as any).role);
      }
    } catch {}

    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData?.user?.email?.toLowerCase();
      if (email === "mrpiglr@gmail.com") return ["owner", "admin", "founder"];
    } catch {}

    try {
      const raw = localStorage.getItem("mock_roles");
      const map = raw ? JSON.parse(raw) : {};
      if (map[userId]) return map[userId];
    } catch {}

    return ["member"];
  },

  async setUserRoles(userId: string, roles: string[]): Promise<void> {
    try {
      const rows = roles.map((role) => ({ user_id: userId, role }));
      const { error } = await supabase.from("user_roles").upsert(rows as any, {
        onConflict: "user_id,role",
      } as any);
      if (!error) return;
    } catch {}

    try {
      const raw = localStorage.getItem("mock_roles");
      const map = raw ? JSON.parse(raw) : {};
      map[userId] = roles;
      localStorage.setItem("mock_roles", JSON.stringify(map));
    } catch {}
  },
};
