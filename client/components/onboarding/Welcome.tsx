import { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { AethexAchievement } from "@/lib/aethex-database-adapter";

interface WelcomeProps {
  data: OnboardingData;
  onFinish?: () => void;
  isFinishing?: boolean;
  achievement?: AethexAchievement;
}

export default function Welcome({
  data,
  onFinish,
  isFinishing,
  achievement,
}: WelcomeProps) {
  const getUserTypeLabel = () => {
    switch (data.userType) {
      case "game-developer":
        return "Game Developer";
      case "client":
        return "Client";
      case "member":
        return "Community Member";
      case "customer":
        return "Customer";
      default:
        return "User";
    }
  };

  const getNextSteps = () => {
    switch (data.userType) {
      case "game-developer":
        return [
          {
            title: "Access Development Tools",
            description:
              "Get started with our development toolkit and resources",
          },
          {
            title: "Join Mentorship Program",
            description: "Connect with experienced developers for guidance",
          },
          {
            title: "Explore Projects",
            description: "Browse collaborative projects and opportunities",
          },
          {
            title: "Attend Workshops",
            description: "Join our next technical workshop or boot camp",
          },
        ];
      case "client":
        return [
          {
            title: "Schedule Consultation",
            description: "Book a free consultation to discuss your project",
          },
          {
            title: "View Our Portfolio",
            description: "Explore our previous work and case studies",
          },
          {
            title: "Get Project Quote",
            description: "Receive a detailed quote for your development needs",
          },
          {
            title: "Meet Your Team",
            description: "Connect with our development specialists",
          },
        ];
      case "member":
        return [
          {
            title: "Explore Research",
            description: "Access our latest research and publications",
          },
          {
            title: "Join Community",
            description: "Connect with other members in our forums",
          },
          {
            title: "Upcoming Events",
            description: "Register for community events and workshops",
          },
          {
            title: "Innovation Labs",
            description: "Participate in cutting-edge research projects",
          },
        ];
      case "customer":
        return [
          {
            title: "Browse Products",
            description: "Explore our games, tools, and digital products",
          },
          {
            title: "Join Beta Programs",
            description: "Get early access to new releases and features",
          },
          {
            title: "Community Hub",
            description: "Connect with other users and share feedback",
          },
          {
            title: "Support Center",
            description: "Access documentation and customer support",
          },
        ];
      default:
        return [];
    }
  };

  const nextSteps = getNextSteps();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient-purple">
            Welcome to AeThex, {data.personalInfo.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Your {getUserTypeLabel().toLowerCase()} account has been
            successfully set up
          </p>
        </div>
      </div>

      {/* User Summary */}
      <Card className="max-w-2xl mx-auto bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-aethex-400" />
            <span>Your AeThex Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-foreground">Role:</strong>
              <p className="text-muted-foreground">{getUserTypeLabel()}</p>
            </div>
            <div>
              <strong className="text-foreground">Experience:</strong>
              <p className="text-muted-foreground capitalize">
                {data.experience.level}
              </p>
            </div>
            <div>
              <strong className="text-foreground">Skills:</strong>
              <p className="text-muted-foreground">
                {data.experience.skills.slice(0, 3).join(", ")}
                {data.experience.skills.length > 3 ? "..." : ""}
              </p>
            </div>
            <div>
              <strong className="text-foreground">Primary Goals:</strong>
              <p className="text-muted-foreground">
                {data.interests.primaryGoals.length} selected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-semibold text-center">What's Next?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nextSteps.map((step, index) => (
            <Card
              key={index}
              className="bg-background/30 border-border/50 hover:border-aethex-400/50 transition-all duration-200"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Button
          onClick={onFinish}
          disabled={isFinishing}
          variant="default"
          className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
        >
          {isFinishing ? "Finishing..." : "Finish & Go to Dashboard"}
        </Button>
        <Button asChild variant="outline" className="border-border/50">
          <Link to="/get-started" className="flex items-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          Need help getting started?{" "}
          <Link to="/support" className="text-aethex-400 hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
