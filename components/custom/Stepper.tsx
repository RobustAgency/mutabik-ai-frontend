import React from "react";

export interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, orientation = "horizontal", className }) => {
  if (orientation === "vertical") {
    return (
      <div className={`flex flex-col ${className ?? ""}`}>
        {steps.map((step, index) => {
            console.log('step', step)
          const isActive = activeStep === step.id;
          const isCompleted = step.id < activeStep;
          const isLast = index === steps.length - 1;
          return (
            <div key={step.id} className="flex items-start gap-4 min-h-[60px]">
              {/* Timeline */}
              <div className="flex flex-col items-center min-h-[60px]">
                {/* Dot */}
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                    isActive
                      ? "bg-primary border-primary"
                      : isCompleted
                      ? "bg-primary border-primary"
                      : "bg-white"
                  }`}
                />
                {/* Line */}
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1  ${isCompleted ? "bg-primary" : "bg-[#B6C2CB]"}`}
                    style={{ minHeight: '60px' }}
                  />
                )}
              </div>
              {/* Step Label */}
              <div
                className={`font-semibold text-base transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-primary"
                    : "text-[#B6C2CB]"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div className={`flex items-center w-full ${className ?? ""}`}> 
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isCompleted = step.id < activeStep;
        const isLast = index === steps.length - 1;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  isActive
                    ? "bg-primary border-primary"
                    : isCompleted
                    ? "bg-white border-white"
                    : "bg-white border-[#B6C2CB]"
                }`}
              />
              <span className={`mt-2 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : isCompleted
                  ? "text-white"
                  : "text-[#B6C2CB]"
              }`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 ${isCompleted ? "bg-primary" : "bg-[#B6C2CB]"}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
