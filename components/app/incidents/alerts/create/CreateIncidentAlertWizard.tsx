"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { incidentAlertSchema, type IncidentAlertFormData } from "@/lib/schemas/incidentAlert.schema";
import {
  useCreateIncidentAlertMutation,
  CreateIncidentAlertData,
  AlertSourceType,
  AlertSeverity,
} from "@/app/lib/features/incidentAlertsApi";
import { IncidentSourceStep } from "./steps/IncidentSourceStep";
import { AlertDetailsStep } from "./steps/AlertDetailsStep";
import { TimelineEvidenceStep } from "./steps/TimelineEvidenceStep";
import { INCIDENT_ALERT_WIZARD_STEPS } from "../constants";

const initialFormData: IncidentAlertFormData = {
  ai_incident_id: 0,
  source_type: AlertSourceType.MONITORING_RULE,
  data_source_id: null,
  alert_sensitivity: AlertSeverity.MEDIUM,
  source_ref: null,
  context: "",
  first_seen_at: "",
  last_seen_at: null,
  evidence_link: null,
  auto_promote_incident: false,
};

const CreateIncidentAlertWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createAlert, { isLoading }] = useCreateIncidentAlertMutation();

  const methods = useForm<IncidentAlertFormData>({
    resolver: zodResolver(incidentAlertSchema) as any,
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
        return await trigger(["ai_incident_id", "source_type"]);
      case 2:
        return await trigger(["alert_sensitivity", "context"]);
      case 3:
        return await trigger(["first_seen_at", "last_seen_at", "evidence_link"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, INCIDENT_ALERT_WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: IncidentAlertFormData) => {
    try {
      // Convert IncidentAlertFormData to CreateIncidentAlertData
      const createData: CreateIncidentAlertData = {
        ai_incident_id: data.ai_incident_id,
        source_type: data.source_type,
        data_source_id: data.data_source_id || null,
        alert_sensitivity: data.alert_sensitivity,
        source_ref: data.source_ref || null,
        context: data.context,
        first_seen_at: data.first_seen_at,
        last_seen_at: data.last_seen_at || null,
        evidence_link: data.evidence_link || null,
        auto_promote_incident: data.auto_promote_incident ?? false,
      };
      await createAlert(createData).unwrap();
      router.push("/governance/incidents/alerts");
    } catch (error: any) {
      console.error("Failed to create incident alert:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <IncidentSourceStep />;
      case 2:
        return <AlertDetailsStep />;
      case 3:
        return <TimelineEvidenceStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Incident Alert
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your incident alert
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
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
              steps={INCIDENT_ALERT_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create Alert"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIncidentAlertWizard;

