"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface MultiStepWizardProps {
  currentStep: number;
  steps: Step[];
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  canProceed?: boolean;
  children: React.ReactNode;
}

export const MultiStepWizard: React.FC<MultiStepWizardProps> = ({
  currentStep,
  steps,
  onNext,
  onPrevious,
  onSubmit,
  isLoading = false,
  canProceed = true,
  children,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  return (
    <div className="w-full">
      {/* Progress Stepper - Clean & Modern Design */}
      <div className="mb-10">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
          
          {/* Progress Bar Fill */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-[#039855] transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              zIndex: 1,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between" style={{ zIndex: 2 }}>
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                  {/* Step Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      transition-all duration-300 border-2
                      ${
                        isCompleted
                          ? "bg-[#039855] border-[#039855] text-white"
                          : isActive
                          ? "bg-[#039855] border-[#039855] text-white shadow-lg shadow-green-200"
                          : "bg-white border-gray-300 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <p
                      className={`text-xs font-medium leading-tight ${
                        isActive 
                          ? "text-[#039855]" 
                          : isCompleted 
                          ? "text-gray-700" 
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">{children}</div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          {!isFirstStep && (
            <Button
              type="button"
              onClick={onPrevious}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {/* {onSaveDraft && (
            <Button
              type="button"
              onClick={onSaveDraft}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300"
            >
              Save Draft
            </Button>
          )} */}

          {!isLastStep ? (
            <Button
              type="button"
              onClick={onNext}
              disabled={isLoading || !canProceed}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#039855] hover:bg-[#027a45] text-white"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#4FD58F] hover:bg-[#3BC577] text-white"
            >
              {isLoading ? "Submitting..." : "Submit Use Case"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

