import { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PersonalInfoProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function PersonalInfo({ data, updateData, nextStep, prevStep }: PersonalInfoProps) {
  const handleInputChange = (field: string, value: string) => {
    updateData({
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const isValid = data.personalInfo.firstName && data.personalInfo.lastName && data.personalInfo.email;

  const getUserTypeLabel = () => {
    switch (data.userType) {
      case 'game-developer': return 'Game Developer';
      case 'client': return 'Client';
      case 'member': return 'Community Member';
      case 'customer': return 'Customer';
      default: return 'User';
    }
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
              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
              onChange={(e) => handleInputChange('lastName', e.target.value)}
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
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="bg-background/50 border-border/50 focus:border-aethex-400"
          />
        </div>

        {(data.userType === 'client' || data.userType === 'game-developer') && (
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Company / Organization
              {data.userType === 'client' && ' *'}
            </Label>
            <Input
              id="company"
              value={data.personalInfo.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder={
                data.userType === 'client' 
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
          onClick={nextStep}
          disabled={!isValid || (data.userType === 'client' && !data.personalInfo.company)}
          className="flex items-center space-x-2 bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          * Required fields
        </p>
      </div>
    </div>
  );
}
