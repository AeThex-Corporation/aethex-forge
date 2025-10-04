import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexUserService } from "@/lib/aethex-database-adapter";

export default function LegacyPassportRedirect() {
  const { id } = useParams<{ id?: string }>();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveTarget = async () => {
      if (!id || id === "me") {
        setTarget("/passport/me");
        return;
      }

      try {
        const profile = await aethexUserService.getProfileById(id);
        if (cancelled) {
          return;
        }

        if (profile?.username) {
          setTarget(`/passport/${profile.username}`);
          return;
        }
      } catch (error) {
        console.warn("Failed to resolve legacy passport redirect", error);
      }

      if (!cancelled) {
        setTarget(`/passport/${id}`);
      }
    };

    resolveTarget();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!target) {
    return <LoadingScreen message="Redirecting to passport..." />;
  }

  return <Navigate to={target} replace />;
}
