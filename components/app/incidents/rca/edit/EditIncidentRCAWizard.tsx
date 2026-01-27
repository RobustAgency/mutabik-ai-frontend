"use client";

import React, { useState, useEffect } from "react";
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
  useGetIncidentRootCauseAnalysisQuery,
  useUpdateIncidentRootCauseAnalysisMutation,
  CreateIncidentRootCauseAnalysisData,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { AnalysisFindingsStep } from "../create/steps/AnalysisFindingsStep";
import { ControlFailuresRecommendationsStep } from "../create/steps/ControlFailuresRecommendationsStep";
import { ApprovalDocumentationStep } from "../create/steps/ApprovalDocumentationStep";
import { INCIDENT_RCA_WIZARD_STEPS } from "../constants";

interface EditIncidentRCAWizardProps {
  rcaId: number;
}

const EditIncidentRCAWizard: React.FC<EditIncidentRCAWizardProps> = ({
  rcaId,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: rca, isLoading: isLoadingRCA } =
    useGetIncidentRootCauseAnalysisQuery(rcaId);
  const [updateRCA, { isLoading }] = useUpdateIncidentRootCauseAnalysisMutation();

  const methods = useForm<IncidentRootCauseAnalysisFormData>({
    resolver: zodResolver(incidentRootCauseAnalysisSchema) as any,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  // Populate form with existing data
  useEffect(() => {
    if (rca) {
      // Format dates for input fields
      const formatDateForInput = (
        dateString: string | null | undefined
      ): string => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        } catch {
          return "";
        }
      };

      const formatDateTimeForInput = (
        dateString: string | null | undefined
      ): string => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
          return "";
        }
      };

      reset({
        ai_incident_id: rca.ai_incident_id,
        rca_method: rca.rca_method,
        analysis_date: formatDateForInput(rca.analysis_date),
        immediate_cause: rca.immediate_cause,
        root_causes: rca.root_causes,
        contributing_factors: rca.contributing_factors || null,
        control_failures: rca.control_failures || null,
        recommendations: rca.recommendations,
        lead_analyst: rca.lead_analyst,
        review_committee: rca.review_committee || null,
        approved_at: formatDateTimeForInput(rca.approved_at),
        report_link: rca.report_link || null,
      });
    }
  }, [rca, reset]);

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
        const updateData: CreateIncidentRootCauseAnalysisData = {
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
        await updateRCA({
          id: rcaId,
          data: updateData,
        }).unwrap();
        router.push("/governance/incidents/rca");
      } catch (error: any) {
        console.error("Failed to update root cause analysis:", error);
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

  if (isLoadingRCA) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="text-center py-12">
            <p className="text-[#667085]">Loading RCA data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Root Cause Analysis
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update the root cause analysis information
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
              submitLabel="Update RCA"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditIncidentRCAWizard;

