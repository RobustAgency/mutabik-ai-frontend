"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  incidentRootCauseAnalysisSchema,
  type IncidentRootCauseAnalysisFormData,
} from "@/lib/schemas/incidentRootCauseAnalysis.schema";
import {
  useCreateIncidentRootCauseAnalysisMutation,
  CreateIncidentRootCauseAnalysisData,
  RcaMethod,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { AnalysisFindingsStep } from "./steps/AnalysisFindingsStep";
import { ControlFailuresRecommendationsStep } from "./steps/ControlFailuresRecommendationsStep";
import { ApprovalDocumentationStep } from "./steps/ApprovalDocumentationStep";
import { INCIDENT_RCA_WIZARD_STEPS } from "../constants";

const initialFormData: IncidentRootCauseAnalysisFormData = {
  ai_incident_id: 0,
  rca_method: RcaMethod.FIVE_WHYS,
  analysis_date: null,
  immediate_cause: "",
  root_causes: "",
  contributing_factors: null,
  control_failures: null,
  recommendations: "",
  lead_analyst: "",
  review_committee: null,
  approved_at: null,
  report_link: null,
};

const CreateIncidentRCAWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createRCA, { isLoading }] = useCreateIncidentRootCauseAnalysisMutation();

  const methods = useForm<IncidentRootCauseAnalysisFormData>({
    resolver: zodResolver(incidentRootCauseAnalysisSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["ai_incident_id", "rca_method"]);
      case 2:
        return await trigger(["immediate_cause", "root_causes"]);
      case 3:
        return await trigger(["recommendations"]);
      case 4:
        return await trigger(["lead_analyst"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) =>
        Math.min(prev + 1, INCIDENT_RCA_WIZARD_STEPS.length)
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(
    async (data: IncidentRootCauseAnalysisFormData) => {
      try {
        // Convert IncidentRootCauseAnalysisFormData to CreateIncidentRootCauseAnalysisData
        const createData: CreateIncidentRootCauseAnalysisData = {
          ai_incident_id: data.ai_incident_id,
          rca_method: data.rca_method,
          analysis_date: data.analysis_date || null,
          immediate_cause: data.immediate_cause,
          root_causes: data.root_causes,
          contributing_factors: data.contributing_factors || null,
          control_failures: data.control_failures || null,
          recommendations: data.recommendations,
          lead_analyst: data.lead_analyst,
          review_committee: data.review_committee || null,
          approved_at: data.approved_at || null,
          report_link: data.report_link || null,
        };
        await createRCA(createData).unwrap();
        router.push("/governance/incidents/rca");
      } catch (error: any) {
        console.error("Failed to create root cause analysis:", error);
      }
    }
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <AnalysisFindingsStep />;
      case 3:
        return <ControlFailuresRecommendationsStep />;
      case 4:
        return <ApprovalDocumentationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Root Cause Analysis
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your root cause analysis
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">
                  Please fix the following errors:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => {
                    const errorMessage = error?.message as string;
                    if (!errorMessage) return null;
                    return (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errorMessage}
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <FormProvider {...methods}>
            <MultiStepWizard
              currentStep={currentStep}
              steps={INCIDENT_RCA_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create RCA"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIncidentRCAWizard;

