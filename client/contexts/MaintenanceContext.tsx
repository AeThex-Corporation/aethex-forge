import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  canBypass: boolean;
  loading: boolean;
  toggleMaintenanceMode: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const ADMIN_ROLES = ["admin", "super_admin", "staff", "owner"];

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const { user, roles, session, loading: authLoading } = useAuth();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdmin = roles.some(role => ADMIN_ROLES.includes(role.toLowerCase()));
  const canBypass = isAdmin && !!user;

  const fetchMaintenanceStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/platform/maintenance");
      if (response.ok) {
        const data = await response.json();
        setIsMaintenanceMode(data.maintenance_mode ?? false);
      }
    } catch (error) {
      console.error("Failed to fetch maintenance status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleMaintenanceMode = useCallback(async () => {
    if (!canBypass) {
      throw new Error("Only admins can toggle maintenance mode");
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      throw new Error("No auth session");
    }

    try {
      const response = await fetch("/api/admin/platform/maintenance", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ maintenance_mode: !isMaintenanceMode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle maintenance mode");
      }

      const data = await response.json();
      setIsMaintenanceMode(data.maintenance_mode);
    } catch (error) {
      console.error("Failed to toggle maintenance mode:", error);
      throw error;
    }
  }, [canBypass, isMaintenanceMode]);

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    await fetchMaintenanceStatus();
  }, [fetchMaintenanceStatus]);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, [fetchMaintenanceStatus]);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        canBypass,
        loading: loading || authLoading,
        toggleMaintenanceMode,
        refreshStatus,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenance must be used within MaintenanceProvider");
  }
  return context;
}
