import { UserType, OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GamepadIcon,
  BriefcaseIcon,
  UsersIcon,
  ShoppingCartIcon,
} from "lucide-react";

interface UserTypeSelectionProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const userTypes = [
  {
    id: "game-developer" as UserType,
    title: "Game Development",
    description:
      "Join our development community, access tools, mentorship, and collaborate on cutting-edge game projects.",
    icon: GamepadIcon,
    benefits: [
      "Access to development tools and frameworks",
      "Mentorship from industry veterans",
      "Collaborative project opportunities",
      "Technical workshops and boot camps",
    ],
    color: "from-neon-purple to-aethex-500",
  },
  {
    id: "client" as UserType,
    title: "Consulting",
    description:
      "Partner with us for custom game development, consulting services, and technical solutions.",
    icon: BriefcaseIcon,
    benefits: [
      "Custom game development services",
      "Technical consulting and strategy",
      "Project management expertise",
      "End-to-end solution delivery",
    ],
    color: "from-neon-blue to-aethex-400",
  },
  {
    id: "member" as UserType,
    title: "Community",
    description:
      "Be part of our innovation community with access to research, networking, and exclusive content.",
    icon: UsersIcon,
    benefits: [
      "Access to research and publications",
      "Networking with industry professionals",
      "Exclusive community events",
      "Early access to new technologies",
    ],
    color: "from-neon-green to-aethex-600",
  },
  {
    id: "customer" as UserType,
    title: "Get Started",
    description:
      "Explore our games, tools, and products designed to enhance your gaming and development experience.",
    icon: ShoppingCartIcon,
    benefits: [
      "Access to premium games and tools",
      "Customer support and documentation",
      "Regular updates and new releases",
      "Community forums and discussions",
    ],
    color: "from-neon-yellow to-aethex-700",
  },
];

export default function UserTypeSelection({
  data,
  updateData,
  nextStep,
}: UserTypeSelectionProps) {
  const handleSelectType = (userType: UserType) => {
    updateData({ userType });
    setTimeout(() => {
      nextStep();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 animate-fade-in">
        <p className="text-muted-foreground">
          Choose the option that best describes your relationship with AeThex
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = data.userType === type.id;

          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-500 hover-lift interactive-scale border-2 animate-scale-in ${
                isSelected
                  ? "border-aethex-500 glow-purple animate-pulse-glow"
                  : "border-border/50 hover:border-aethex-400/50"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSelectType(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${type.color} transition-all duration-300 hover:scale-110 ${isSelected ? "animate-bounce-gentle" : ""}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle
                      className={`text-lg transition-all duration-300 ${isSelected ? "text-gradient animate-pulse" : ""}`}
                    >
                      {type.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-sm transition-all duration-300 hover:text-muted-foreground/80">
                  {type.description}
                </CardDescription>
                <ul className="space-y-1">
                  {type.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className={`text-xs text-muted-foreground flex items-start transition-all duration-300 animate-slide-left ${
                        isSelected ? "text-aethex-300" : ""
                      }`}
                      style={{
                        animationDelay: `${index * 0.1 + benefitIndex * 0.05}s`,
                      }}
                    >
                      <span
                        className={`mr-2 transition-all duration-300 ${isSelected ? "text-aethex-400 animate-pulse" : "text-aethex-400"}`}
                      >
                        •
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4 pt-6">
        <div
          className="flex justify-center animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-sm text-muted-foreground text-center max-w-lg">
            Don't worry - you can always change your preferences later or access
            multiple areas of our platform.
          </p>
        </div>

        <div
          className="flex justify-center animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Already have an AeThex account?
            </p>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-aethex-400/30 text-aethex-400 hover:bg-aethex-400/10 hover:border-aethex-400 hover-lift transition-all duration-300"
            >
              <Link to="/login">Sign In to Your Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
