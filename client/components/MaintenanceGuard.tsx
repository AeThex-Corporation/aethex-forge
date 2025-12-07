import React from "react";
import { useLocation } from "react-router-dom";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import MaintenancePage from "@/pages/Maintenance";

const ALLOWED_PATHS = ["/login", "/staff/login", "/reset-password", "/health"];

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const { isMaintenanceMode, canBypass, loading } = useMaintenance();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAllowedPath = ALLOWED_PATHS.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  if (isMaintenanceMode && !canBypass && !isAllowedPath) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
