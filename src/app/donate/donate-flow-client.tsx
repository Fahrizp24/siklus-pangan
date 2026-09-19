"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/pages/donate/hero-section";
import { RegistrationFormSection } from "@/components/pages/donate/registration-form-section";

export function DonateFlowClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepProgress = (step: number, completed: number[]) => {
    setCurrentStep(step);
    setCompletedSteps(completed);
  };

  return (
    <div className="w-full flex flex-col gap-8 sm:gap-10 items-center justify-start">
      <HeroSection currentStep={currentStep} completedSteps={completedSteps} />
      <RegistrationFormSection onStepProgress={handleStepProgress} />
    </div>
  );
}
