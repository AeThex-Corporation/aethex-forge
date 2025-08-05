import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { SkeletonOnboardingStep } from "@/components/Skeleton";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import PersonalInfo from "@/components/onboarding/PersonalInfo";
import Experience from "@/components/onboarding/Experience";
import Interests from "@/components/onboarding/Interests";
import Welcome from "@/components/onboarding/Welcome";

export type UserType = 'game-developer' | 'client' | 'member' | 'customer';

export interface OnboardingData {
  userType: UserType | null;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  };
  experience: {
    level: string;
    skills: string[];
    previousProjects?: string;
  };
  interests: {
    primaryGoals: string[];
    preferredServices: string[];
  };
}

const initialData: OnboardingData = {
  userType: null,
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  },
  experience: {
    level: '',
    skills: [],
    previousProjects: '',
  },
  interests: {
    primaryGoals: [],
    preferredServices: [],
  },
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);

  const steps = [
    { title: "Choose Your Path", component: UserTypeSelection },
    { title: "Personal Information", component: PersonalInfo },
    { title: "Experience Level", component: Experience },
    { title: "Interests & Goals", component: Interests },
    { title: "Welcome to AeThex", component: Welcome },
  ];

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gradient">Join AeThex</h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-aethex-500 to-neon-blue h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {steps[currentStep].title}
              </h2>
            </div>

            <CurrentStepComponent
              data={data}
              updateData={updateData}
              nextStep={nextStep}
              prevStep={prevStep}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
