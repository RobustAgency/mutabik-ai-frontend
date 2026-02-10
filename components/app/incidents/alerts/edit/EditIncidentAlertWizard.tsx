"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { incidentAlertSchema, type IncidentAlertFormData } from "@/lib/schemas/incidentAlert.schema";
import {
  useGetIncidentAlertQuery,
  useUpdateIncidentAlertMutation,
  CreateIncidentAlertData,
} from "@/app/lib/features/incidentAlertsApi";
import { IncidentSourceStep } from "../create/steps/IncidentSourceStep";
import { AlertDetailsStep } from "../create/steps/AlertDetailsStep";
import { TimelineEvidenceStep } from "../create/steps/TimelineEvidenceStep";
import { INCIDENT_ALERT_WIZARD_STEPS } from "../constants";

interface EditIncidentAlertWizardProps {
  alertId: number;
}

const EditIncidentAlertWizard: React.FC<EditIncidentAlertWizardProps> = ({ alertId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: alert, isLoading: isLoadingAlert } = useGetIncidentAlertQuery(alertId);
  const [updateAlert, { isLoading }] = useUpdateIncidentAlertMutation();

  const methods = useForm<IncidentAlertFormData>({
    resolver: zodResolver(incidentAlertSchema) as any,
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
    if (alert) {
      // Format datetime for input fields
      const formatDateTimeForInput = (dateString: string | null | undefined): string => {
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
        ai_incident_id: alert.ai_incident_id,
        source_type: alert.source_type,
        data_source_id: alert.data_source_id || null,
        alert_sensitivity: alert.alert_sensitivity,
        source_ref: alert.source_ref || null,
        context: alert.context || "",
        first_seen_at: formatDateTimeForInput(alert.first_seen_at),
        last_seen_at: formatDateTimeForInput(alert.last_seen_at),
        evidence_link: alert.evidence_link || null,
        auto_promote_incident: alert.auto_promote_incident || false,
      });
    }
  }, [alert, reset]);

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
      const updateData: CreateIncidentAlertData = {
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
      await updateAlert({
        id: alertId,
        data: updateData,
      }).unwrap();
      router.push("/governance/incidents/alerts");
    } catch (error: any) {
      console.error("Failed to update incident alert:", error);
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

  if (isLoadingAlert) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="text-center py-12">
            <p className="text-[#667085]">Loading alert data...</p>
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
            Edit Incident Alert
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update the incident alert information
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
              submitLabel="Update Alert"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditIncidentAlertWizard;

