import { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { useState } from "react";

interface ExperienceProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const experienceLevels = [
  { id: "beginner", label: "Beginner", description: "New to the field" },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "1-3 years experience",
  },
  { id: "advanced", label: "Advanced", description: "3-7 years experience" },
  { id: "expert", label: "Expert", description: "7+ years experience" },
];

const skillSuggestions = {
  "game-developer": [
    "Unity",
    "Unreal Engine",
    "C#",
    "C++",
    "JavaScript",
    "Python",
    "Blender",
    "3D Modeling",
    "Game Design",
    "Level Design",
    "Animation",
    "Shader Programming",
    "Roblox Development",
  ],
  client: [
    "Project Management",
    "Business Strategy",
    "Product Development",
    "Marketing",
    "Team Leadership",
    "Budget Management",
    "Quality Assurance",
    "User Experience",
  ],
  member: [
    "Research",
    "Innovation",
    "Technology Trends",
    "Community Building",
    "Networking",
    "Content Creation",
    "Documentation",
    "Knowledge Sharing",
  ],
  customer: [
    "Gaming",
    "Technology Adoption",
    "User Feedback",
    "Beta Testing",
    "Community Participation",
    "Content Consumption",
    "Product Evaluation",
  ],
};

export default function Experience({
  data,
  updateData,
  nextStep,
  prevStep,
}: ExperienceProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleLevelChange = (level: string) => {
    updateData({
      experience: {
        ...data.experience,
        level,
      },
    });
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !data.experience.skills.includes(skill)) {
      updateData({
        experience: {
          ...data.experience,
          skills: [...data.experience.skills, skill],
        },
      });
    }
    setNewSkill("");
  };

  const handleSkillRemove = (skillToRemove: string) => {
    updateData({
      experience: {
        ...data.experience,
        skills: data.experience.skills.filter(
          (skill) => skill !== skillToRemove,
        ),
      },
    });
  };

  const handleProjectsChange = (projects: string) => {
    updateData({
      experience: {
        ...data.experience,
        previousProjects: projects,
      },
    });
  };

  const isValid = data.experience.level && data.experience.skills.length > 0;
  const suggestions = data.userType
    ? skillSuggestions[data.userType] || []
    : [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Help us understand your background and expertise
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Experience Level *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {experienceLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelChange(level.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  data.experience.level === level.id
                    ? "border-aethex-500 bg-aethex-500/10 glow-purple"
                    : "border-border/50 hover:border-aethex-400/50 bg-background/50"
                }`}
              >
                <div className="font-medium">{level.label}</div>
                <div className="text-sm text-muted-foreground">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Skills & Technologies *</Label>

          {/* Current Skills */}
          {data.experience.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.experience.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-aethex-500/20 text-aethex-300 border-aethex-500/30 hover:bg-aethex-500/30"
                >
                  {skill}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                    onClick={() => handleSkillRemove(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Add Custom Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 text-sm rounded-md border border-border/50 bg-background/50 focus:border-aethex-400 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSkillAdd(newSkill);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => handleSkillAdd(newSkill)}
              disabled={!newSkill.trim()}
              className="bg-gradient-to-r from-aethex-500 to-neon-blue"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Skill Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Suggested skills:
              </Label>
              <div className="flex flex-wrap gap-2">
                {suggestions
                  .filter((skill) => !data.experience.skills.includes(skill))
                  .slice(0, 8)
                  .map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillAdd(skill)}
                      className="px-3 py-1 text-xs rounded-full border border-border/50 hover:border-aethex-400/50 hover:bg-aethex-500/10 transition-all duration-200"
                    >
                      {skill}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Previous Projects (optional for some user types) */}
        {(data.userType === "game-developer" || data.userType === "client") && (
          <div className="space-y-2">
            <Label htmlFor="projects" className="text-sm font-medium">
              Previous Projects or Experience
              <span className="text-muted-foreground"> (optional)</span>
            </Label>
            <Textarea
              id="projects"
              value={data.experience.previousProjects || ""}
              onChange={(e) => handleProjectsChange(e.target.value)}
              placeholder="Tell us about your previous projects, experiences, or achievements..."
              className="bg-background/50 border-border/50 focus:border-aethex-400 min-h-[100px]"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <Button
          onClick={nextStep}
          disabled={!isValid}
          className="flex items-center space-x-2 bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
