import { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface InterestsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const goalOptions = {
  "game-developer": [
    "Learn new game development technologies",
    "Get mentorship from industry experts",
    "Collaborate on innovative projects",
    "Build a portfolio of game projects",
    "Join a development team",
    "Start freelancing in game development",
    "Improve programming skills",
    "Learn game design principles",
  ],
  client: [
    "Develop a custom game or application",
    "Get technical consulting for my project",
    "Find reliable development partners",
    "Scale my existing game/platform",
    "Implement new features or technologies",
    "Optimize performance and user experience",
    "Launch a new digital product",
    "Build a development team",
  ],
  member: [
    "Stay updated on industry trends",
    "Network with tech professionals",
    "Access research and insights",
    "Participate in innovation projects",
    "Share knowledge with the community",
    "Explore new technologies",
    "Contribute to open source projects",
    "Attend workshops and events",
  ],
  customer: [
    "Play cutting-edge games",
    "Access premium development tools",
    "Get early access to new releases",
    "Join beta testing programs",
    "Connect with other gamers",
    "Learn about game development",
    "Provide feedback on products",
    "Explore interactive experiences",
  ],
};

const serviceOptions = {
  "game-developer": [
    "Mentorship Programs",
    "Development Tools Access",
    "Collaborative Projects",
    "Technical Workshops",
    "Code Review Services",
    "Career Guidance",
    "Networking Events",
    "Skill Assessments",
  ],
  client: [
    "Custom Game Development",
    "Technical Consulting",
    "Project Management",
    "Quality Assurance",
    "Performance Optimization",
    "Team Augmentation",
    "Technology Integration",
    "Ongoing Support",
  ],
  member: [
    "Research Access",
    "Community Forums",
    "Expert Insights",
    "Innovation Labs",
    "Knowledge Base",
    "Networking Platform",
    "Event Participation",
    "Content Library",
  ],
  customer: [
    "Premium Games",
    "Development Tools",
    "Beta Access",
    "Community Features",
    "Customer Support",
    "Regular Updates",
    "Educational Content",
    "User Forums",
  ],
};

export default function Interests({
  data,
  updateData,
  nextStep,
  prevStep,
}: InterestsProps) {
  const goals = data.userType ? goalOptions[data.userType] || [] : [];
  const services = data.userType ? serviceOptions[data.userType] || [] : [];

  const handleGoalToggle = (goal: string) => {
    const currentGoals = data.interests.primaryGoals;
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];

    updateData({
      interests: {
        ...data.interests,
        primaryGoals: updatedGoals,
      },
    });
  };

  const handleServiceToggle = (service: string) => {
    const currentServices = data.interests.preferredServices;
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];

    updateData({
      interests: {
        ...data.interests,
        preferredServices: updatedServices,
      },
    });
  };

  const isValid =
    data.interests.primaryGoals.length > 0 &&
    data.interests.preferredServices.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Tell us about your goals and interests so we can personalize your
          experience
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Primary Goals */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Primary Goals *</Label>
          <p className="text-xs text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goals.map((goal) => {
              const isSelected = data.interests.primaryGoals.includes(goal);
              return (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-3 rounded-lg border-2 text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? "border-aethex-500 bg-aethex-500/10 text-aethex-300"
                      : "border-border/50 hover:border-aethex-400/50 bg-background/50 hover:bg-aethex-500/5"
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Services */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Services of Interest *</Label>
          <p className="text-xs text-muted-foreground">
            Select all that interest you
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => {
              const isSelected =
                data.interests.preferredServices.includes(service);
              return (
                <button
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`p-3 rounded-lg border-2 text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? "border-neon-blue bg-neon-blue/10 text-neon-blue"
                      : "border-border/50 hover:border-neon-blue/50 bg-background/50 hover:bg-neon-blue/5"
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </div>
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
          <span>Complete Setup</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          You can always update your preferences later in your account settings
        </p>
      </div>
    </div>
  );
}
