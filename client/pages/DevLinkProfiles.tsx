import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Github,
  Briefcase,
  MapPin,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface DevProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills: string[];
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  looking_for?: string;
  portfolio_url?: string;
  github_url?: string;
  created_at: string;
}

export default function DevLinkProfiles() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dev-link")}
          className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-2"
        >
          ← Back to Dev-Link
        </button>

        {/* Fullscreen iframe */}
        <iframe
          src="https://dev-link.me"
          className="w-full h-full border-0"
          title="Dev-Link Platform"
        />
      </div>
    </div>
  );
}
