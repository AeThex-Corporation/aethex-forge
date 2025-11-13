import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Zap,
  Gamepad2,
  Briefcase,
  BookOpen,
  Network,
  Sparkles,
  Shield,
} from "lucide-react";

interface FollowArmsProps {
  selectedArms: string[];
  onUpdate: (arms: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ARMS = [
  {
    id: "labs",
    name: "AeThex Labs",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    description: "Research, innovation, and experimental tech",
  },
  {
    id: "gameforge",
    name: "GameForge",
    icon: Gamepad2,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Game development and interactive experiences",
  },
  {
    id: "corp",
    name: "AeThex Corp",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Enterprise consulting and professional services",
  },
  {
    id: "foundation",
    name: "AeThex Foundation",
    icon: BookOpen,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description: "Education, mentorship, and community building",
  },
  {
    id: "devlink",
    name: "Dev-Link",
    icon: Network,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    description: "Professional networking and opportunities",
  },
  {
    id: "nexus",
    name: "NEXUS",
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "Creative marketplace and artist collaboration",
  },
];

export default function FollowArms({
  selectedArms,
  onUpdate,
  nextStep,
  prevStep,
}: FollowArmsProps) {
  const [localSelection, setLocalSelection] = useState(selectedArms);

  const handleToggle = (armId: string) => {
    setLocalSelection((prev) =>
      prev.includes(armId) ? prev.filter((a) => a !== armId) : [...prev, armId]
    );
  };

  const handleContinue = () => {
    if (localSelection.length === 0) {
      alert("Please select at least one arm to follow");
      return;
    }
    onUpdate(localSelection);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Choose which AeThex arms you want to follow. You can change this
          anytime in your settings. Select at least one to continue.
        </p>
      </div>

      {/* Arms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARMS.map((arm) => {
          const Icon = arm.icon;
          const isSelected = localSelection.includes(arm.id);

          return (
            <div key={arm.id} className="relative">
              <Card
                className={`cursor-pointer border-2 transition-all duration-200 hover:border-opacity-100 ${
                  isSelected
                    ? `${arm.borderColor} bg-${arm.color}/5`
                    : "border-border/40 hover:border-border/60"
                }`}
                onClick={() => handleToggle(arm.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-5 w-5 ${arm.color}`} />
                        <h3 className="font-semibold text-foreground">
                          {arm.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {arm.description}
                      </p>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(arm.id)}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {localSelection.length > 0 && (
        <Card className="bg-aethex-500/10 border-aethex-400/30">
          <CardContent className="p-4">
            <p className="text-sm text-aethex-200">
              You're following <span className="font-bold">{localSelection.length}</span> arm
              {localSelection.length !== 1 ? "s" : ""}
              {localSelection.length > 0 && ":"}
              <span className="ml-2">
                {localSelection
                  .map(
                    (id) =>
                      ARMS.find((a) => a.id === id)?.name || id
                  )
                  .join(", ")}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-gradient-to-r from-aethex-600 to-neon-blue hover:from-aethex-700 hover:to-neon-blue/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
