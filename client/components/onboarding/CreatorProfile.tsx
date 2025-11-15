import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { ChevronRight, Zap, Users, Code } from "lucide-react";

interface CreatorProfileProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const AVAILABLE_ARMS = [
  {
    id: "labs",
    name: "Labs",
    description: "R&D & Innovation",
    color: "from-yellow-500 to-orange-500",
    icon: Zap,
  },
  {
    id: "gameforge",
    name: "GameForge",
    description: "Game Development",
    color: "from-green-500 to-emerald-500",
    icon: Code,
  },
  {
    id: "corp",
    name: "Corp",
    description: "Enterprise Consulting",
    color: "from-blue-500 to-cyan-500",
    icon: Users,
  },
  {
    id: "foundation",
    name: "Foundation",
    description: "Education & Open Source",
    color: "from-red-500 to-pink-500",
    icon: Users,
  },
];

const SKILL_SUGGESTIONS = [
  "Game Development",
  "Web Development",
  "Backend Development",
  "Machine Learning",
  "UI/UX Design",
  "DevOps",
  "Mobile Development",
  "Data Science",
  "Cloud Architecture",
  "3D Modeling",
  "Audio Engineering",
  "Project Management",
  "Community Building",
  "Technical Writing",
  "Open Source",
];

export default function CreatorProfile({
  data,
  updateData,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}: CreatorProfileProps) {
  const [inputValue, setInputValue] = useState("");
  const creatorData = {
    bio: data?.creatorProfile?.bio || "",
    skills: Array.isArray(data?.creatorProfile?.skills)
      ? data.creatorProfile.skills
      : [],
    primaryArm: data?.creatorProfile?.primaryArm || "",
  };

  const canProceed = useMemo(() => {
    return creatorData.primaryArm && creatorData.skills.length > 0;
  }, [creatorData.primaryArm, creatorData.skills.length]);

  const handleAddSkill = (skill: string) => {
    if (!creatorData.skills.includes(skill)) {
      updateData({
        creatorProfile: {
          ...creatorData,
          skills: [...creatorData.skills, skill],
        },
      });
    }
    setInputValue("");
  };

  const handleRemoveSkill = (skill: string) => {
    updateData({
      creatorProfile: {
        ...creatorData,
        skills: creatorData.skills.filter((s) => s !== skill),
      },
    });
  };

  const handleSelectArm = (armId: string) => {
    updateData({
      creatorProfile: {
        ...creatorData,
        primaryArm: armId,
      },
    });
  };

  const handleBioChange = (bio: string) => {
    updateData({
      creatorProfile: {
        ...creatorData,
        bio,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Bio Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-200 block mb-2">
            Creator Bio (Optional)
          </label>
          <textarea
            value={creatorData.bio || ""}
            onChange={(e) => handleBioChange(e.target.value)}
            placeholder="Tell the community about yourself, your experience, and what you're passionate about..."
            className="w-full h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-2">
            {(creatorData.bio || "").length}/500 characters
          </p>
        </div>
      </div>

      {/* Primary Arm Selection */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-200 block">
          Which pillar are you most interested in? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_ARMS.map((arm) => {
            const Icon = arm.icon;
            const isSelected = creatorData.primaryArm === arm.id;
            return (
              <button
                key={arm.id}
                onClick={() => handleSelectArm(arm.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30"
                    : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded bg-gradient-to-r ${arm.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{arm.name}</div>
                    <div className="text-xs text-gray-400">
                      {arm.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Selection */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-200 block">
          What are your skills? *{" "}
          <span className="text-xs text-gray-400 font-normal">
            (Add at least 1)
          </span>
        </label>

        {/* Skills Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddSkill(inputValue.trim());
              }
            }}
            placeholder="Type a skill and press Enter..."
            className="flex-1 bg-gray-900/50 border-gray-700"
          />
          <Button
            onClick={() => {
              if (inputValue.trim()) {
                handleAddSkill(inputValue.trim());
              }
            }}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add
          </Button>
        </div>

        {/* Selected Skills */}
        {creatorData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {creatorData.skills.map((skill: string) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-blue-500/20 text-blue-300 border-blue-500/40 cursor-pointer hover:bg-blue-500/30"
                onClick={() => handleRemoveSkill(skill)}
              >
                {skill}
                <span className="ml-2 text-xs">✕</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Skill Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {SKILL_SUGGESTIONS.map((skill) => (
              <button
                key={skill}
                onClick={() => handleAddSkill(skill)}
                disabled={creatorData.skills.includes(skill)}
                className={`px-2 py-1 text-xs rounded-md transition-all ${
                  creatorData.skills.includes(skill)
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer"
                }`}
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-8 border-t border-gray-800">
        <Button onClick={prevStep} variant="outline" className="flex-1">
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
