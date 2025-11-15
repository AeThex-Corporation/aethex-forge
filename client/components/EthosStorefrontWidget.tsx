import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Toggle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from "lucide-react";

export interface EthosStorefrontData {
  for_hire: boolean;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  services: EthosService[];
  verified?: boolean;
  profile_url?: string;
}

export interface EthosService {
  id: string;
  name: string;
  type: "track" | "sfx" | "service";
  price?: number;
  currency?: string;
  description?: string;
}

interface EthosStorefrontWidgetProps {
  data: EthosStorefrontData;
  onToggleForHire?: (enabled: boolean) => void;
  onEditProfile?: () => void;
  accentColor?: "purple" | "blue" | "cyan" | "green" | "amber" | "red";
}

const colorMap = {
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
    accent: "bg-purple-600 hover:bg-purple-700",
    text: "text-purple-300",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
    accent: "bg-blue-600 hover:bg-blue-700",
    text: "text-blue-300",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/40 to-cyan-900/20",
    border: "border-cyan-500/20",
    accent: "bg-cyan-600 hover:bg-cyan-700",
    text: "text-cyan-300",
  },
  green: {
    bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
    border: "border-green-500/20",
    accent: "bg-green-600 hover:bg-green-700",
    text: "text-green-300",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-950/40 to-amber-900/20",
    border: "border-amber-500/20",
    accent: "bg-amber-600 hover:bg-amber-700",
    text: "text-amber-300",
  },
  red: {
    bg: "bg-gradient-to-br from-red-950/40 to-red-900/20",
    border: "border-red-500/20",
    accent: "bg-red-600 hover:bg-red-700",
    text: "text-red-300",
  },
};

export function EthosStorefrontWidget({
  data,
  onToggleForHire,
  onEditProfile,
  accentColor = "purple",
}: EthosStorefrontWidgetProps) {
  const [isForHire, setIsForHire] = useState(data.for_hire);
  const colors = colorMap[accentColor];

  const handleToggleForHire = async (enabled: boolean) => {
    setIsForHire(enabled);
    if (onToggleForHire) {
      onToggleForHire(enabled);
    }
  };

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          My ETHOS Storefront
        </CardTitle>
        <CardDescription>
          Your marketplace presence for services and tracks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          {data.avatar_url && (
            <img
              src={data.avatar_url}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-gray-500/30 object-cover"
            />
          )}
          <div className="flex-1">
            {data.headline && (
              <h3 className="text-lg font-semibold text-white">
                {data.headline}
              </h3>
            )}
            {data.bio && (
              <p className="text-sm text-gray-400 mt-1">{data.bio}</p>
            )}
            {data.verified && (
              <Badge className="bg-green-600/50 text-green-100 mt-2">
                ✓ Verified
              </Badge>
            )}
          </div>
        </div>

        {/* For Hire Toggle */}
        <div className="p-4 bg-black/30 rounded-lg border border-gray-500/10 flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">Available for Work</p>
            <p className="text-sm text-gray-400">
              Is your profile visible to clients?
            </p>
          </div>
          <button
            onClick={() => handleToggleForHire(!isForHire)}
            className="focus:outline-none"
          >
            {isForHire ? (
              <ToggleRight className="h-8 w-8 text-green-500 transition" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-500 transition" />
            )}
          </button>
        </div>

        {/* Service Menu */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white">Service Menu</h4>
          {data.services.length === 0 ? (
            <p className="text-sm text-gray-400">No services listed</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {service.name}
                      </p>
                      <Badge className="text-xs mt-1 bg-gray-600/50">
                        {service.type}
                      </Badge>
                    </div>
                    {service.price && (
                      <p className="font-bold text-green-400 flex-shrink-0">
                        ${service.price}
                      </p>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
            onClick={onEditProfile}
          >
            <Music className="h-4 w-4 mr-2" />
            Edit Service Menu
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className={colors.accent}
            onClick={() => window.open(data.profile_url, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Profile
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-500/20 text-gray-300 hover:bg-gray-500/10"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EthosStorefrontWidget;
