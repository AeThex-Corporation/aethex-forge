import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ARMS = [
  { id: "labs", label: "Labs", icon: "🔬", color: "text-yellow-300" },
  { id: "gameforge", label: "GameForge", icon: "🎮", color: "text-green-300" },
  { id: "corp", label: "Corp", icon: "💼", color: "text-blue-300" },
  { id: "foundation", label: "Foundation", icon: "🎓", color: "text-red-300" },
  { id: "nexus", label: "Nexus", icon: "✨", color: "text-purple-300" },
];

export interface ArmFilterProps {
  selectedArm?: string;
  onArmChange: (arm: string | undefined) => void;
}

export function ArmFilter({ selectedArm, onArmChange }: ArmFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Filter by Arm</h3>
      <div className="space-y-2">
        <Button
          onClick={() => onArmChange(undefined)}
          variant={!selectedArm ? "default" : "ghost"}
          className="w-full justify-start text-left"
        >
          {!selectedArm && <Check className="h-4 w-4 mr-2" />}
          All Arms
        </Button>
        {ARMS.map((arm) => (
          <Button
            key={arm.id}
            onClick={() => onArmChange(arm.id)}
            variant={selectedArm === arm.id ? "default" : "ghost"}
            className="w-full justify-start text-left"
          >
            {selectedArm === arm.id && <Check className="h-4 w-4 mr-2" />}
            <span className="mr-2">{arm.icon}</span>
            {arm.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
