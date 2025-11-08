import { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface PersonalInfoProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function PersonalInfo({
  data,
  updateData,
  nextStep,
  prevStep,
}: PersonalInfoProps) {
  const { user, signUp } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    updateData({
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const passwordsValid = () => {
    if (user) return true;
    const pwd = data.personalInfo.password?.trim() || "";
    const confirm = data.personalInfo.confirmPassword?.trim() || "";
    return pwd.length >= 8 && pwd === confirm;
  };

  const isValid =
    data.personalInfo.firstName &&
    data.personalInfo.lastName &&
    data.personalInfo.email &&
    passwordsValid();

  const getUserTypeLabel = () => {
    switch (data.userType) {
      case "game-developer":
        return "Game Development";
      case "client":
        return "Consulting";
      case "member":
        return "Community";
      case "customer":
        return "Get Started";
      default:
        return "User";
    }
  };

  const handleContinue = async () => {
    if (!isValid) return;
    if (!user) {
      try {
        setSubmitting(true);
        const fullName =
          `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim();
        const userTypeMap: Record<string, string> = {
          "game-developer": "game_developer",
          client: "client",
          member: "community_member",
          customer: "customer",
        };
        await signUp(
          data.personalInfo.email,
          data.personalInfo.password || "",
          {
            full_name: fullName,
            user_type: userTypeMap[data.userType || "member"] as any,
            username:
              data.personalInfo.firstName.replace(/\s+/g, "_") || "user",
          } as any,
        );
      } catch (e) {
        setSubmitting(false);
        return; // error toast handled by AuthContext
      }
    }
    setSubmitting(false);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Tell us a bit about yourself, {getUserTypeLabel().toLowerCase()}
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={data.personalInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="bg-background/50 border-border/50 focus:border-aethex-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={data.personalInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="bg-background/50 border-border/50 focus:border-aethex-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
            className="bg-background/50 border-border/50 focus:border-aethex-400"
          />
        </div>

        {!user && (
          <>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password (min 8 chars) *
              </Label>
              <Input
                id="password"
                type="password"
                value={data.personalInfo.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
                className="bg-background/50 border-border/50 focus:border-aethex-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={data.personalInfo.confirmPassword || ""}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Re-enter password"
                className="bg-background/50 border-border/50 focus:border-aethex-400"
              />
            </div>
          </>
        )}

        {(data.userType === "client" || data.userType === "game-developer") && (
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Company / Organization
              {data.userType === "client" && " *"}
            </Label>
            <Input
              id="company"
              value={data.personalInfo.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder={
                data.userType === "client"
                  ? "Enter your company name"
                  : "Enter your company/organization (optional)"
              }
              className="bg-background/50 border-border/50 focus:border-aethex-400"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 animate-slide-up">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex items-center space-x-2 hover-lift interactive-scale group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Button>

        <Button
          onClick={handleContinue}
          disabled={
            submitting ||
            !isValid ||
            (data.userType === "client" && !data.personalInfo.company)
          }
          className="flex items-center space-x-2 bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{submitting ? "Creating account…" : "Continue"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">* Required fields</p>
      </div>
    </div>
  );
}
