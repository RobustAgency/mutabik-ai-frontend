"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { aiIncidentSchema, type AiIncidentFormData } from "@/lib/schemas/aiIncident.schema";
import {
  useGetAiIncidentQuery,
  useUpdateAiIncidentMutation,
  CreateAiIncidentData,
  IncidentType,
  Domain,
  ResponseTeam,
  PrimaryRegulatoryFramework,
  NotificationRequirement,
  ImpactedDataType,
} from "@/app/lib/features/aiIncidentsApi";
import { AI_INCIDENT_WIZARD_STEPS } from "../constants";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { ResponseGovernanceStep } from "../create/steps/ResponseGovernanceStep";
import { ImpactAssessmentStep } from "../create/steps/ImpactAssessmentStep";
import { LinksEvidenceStep } from "../create/steps/LinksEvidenceStep";

interface EditAiIncidentWizardProps {
  incidentId: number;
}

const EditAiIncidentWizard: React.FC<EditAiIncidentWizardProps> = ({ incidentId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: incident, isLoading: isLoadingIncident } = useGetAiIncidentQuery(incidentId);
  const [updateIncident, { isLoading }] = useUpdateAiIncidentMutation();

  const methods = useForm<AiIncidentFormData>({
    resolver: zodResolver(aiIncidentSchema) as any,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (incident) {
      // Convert null to undefined for react-hook-form compatibility
      // Handle estimated_impacted_records - convert string to number if needed
      const estimated_impacted_records = typeof incident.estimated_impacted_records === 'string'
        ? parseInt(incident.estimated_impacted_records, 10)
        : incident.estimated_impacted_records || 0;
      
      const estimated_impacted_users = typeof incident.estimated_impacted_users === 'string'
        ? parseInt(incident.estimated_impacted_users, 10)
        : (incident.estimated_impacted_users ?? undefined);
      
      reset({
        title: incident.title,
        summary: incident.summary,
        // Required fields - API can return null but form requires them, so we assert
        // In practice, existing incidents should always have these values set
        incident_type: (incident.incident_type ?? undefined) as IncidentType,
        domain: (incident.domain ?? undefined) as Domain,
        severity: incident.severity,
        status: incident.status,
        incident_commander: incident.incident_commander,
        response_team: (incident.response_team ?? undefined) as ResponseTeam,
        primary_regulatory_framework: (incident.primary_regulatory_framework ?? undefined) as PrimaryRegulatoryFramework,
        notification_requirement: (incident.notification_requirement ?? undefined) as NotificationRequirement,
        data_residency_affected: incident.data_residency_affected ?? undefined,
        regulatory_reference: incident.regulatory_reference ?? undefined,
        estimated_impacted_users,
        estimated_impacted_records,
        data_types_impacted: (incident.data_types_impacted ?? []) as ImpactedDataType[],
        affected_business_units: incident.affected_business_units ?? undefined,
        external_parties_involved: incident.external_parties_involved ?? undefined,
        business_impact_description: incident.business_impact_description ?? undefined,
        impacted_systems: incident.impacted_systems ?? undefined,
        ai_model_id: incident.ai_model_id ?? undefined,
        linked_dataset_id: incident.linked_dataset_id ?? undefined,
        linked_risk_id: incident.linked_risk_id ?? undefined,
        evidence_link: incident.evidence_link ?? undefined,
      });
    }
  }, [incident, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger([
          "title",
          "summary",
          "incident_type",
          "domain",
          "severity",
          "status",
        ]);
      case 2:
        return await trigger([
          "incident_commander",
          "response_team",
          "primary_regulatory_framework",
          "notification_requirement",
        ]);
      case 3:
        return await trigger([
          "estimated_impacted_records",
          "data_types_impacted",
        ]);
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, AI_INCIDENT_WIZARD_STEPS.length));
    }
  };

  // Get fields relevant to current step for error checking
  const getCurrentStepFields = (step: number): (keyof AiIncidentFormData)[] => {
    switch (step) {
      case 1:
        return ["title", "summary", "incident_type", "domain", "severity", "status"];
      case 2:
        return ["incident_commander", "response_team", "primary_regulatory_framework", "notification_requirement"];
      case 3:
        return ["estimated_impacted_records", "data_types_impacted"];
      case 4:
        return [];
      default:
        return [];
    }
  };

  // Check if there are errors in the current step
  const currentStepFields = getCurrentStepFields(currentStep);
  const hasCurrentStepErrors = currentStepFields.some(field => errors[field]?.message);

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = async (data: AiIncidentFormData) => {
    try {
      const payload: Partial<CreateAiIncidentData> = {
        title: data.title,
        summary: data.summary,
        incident_type: data.incident_type,
        domain: data.domain,
        severity: data.severity,
        status: data.status,
        incident_commander: data.incident_commander,
        response_team: data.response_team,
        primary_regulatory_framework: data.primary_regulatory_framework,
        notification_requirement: data.notification_requirement,
        data_residency_affected: data.data_residency_affected || null,
        regulatory_reference: data.regulatory_reference || null,
        estimated_impacted_users: data.estimated_impacted_users || null,
        estimated_impacted_records: data.estimated_impacted_records,
        data_types_impacted: data.data_types_impacted,
        affected_business_units: data.affected_business_units || null,
        external_parties_involved: data.external_parties_involved || null,
        business_impact_description: data.business_impact_description || null,
        impacted_systems: data.impacted_systems || null,
        ai_model_id: data.ai_model_id || null,
        linked_dataset_id: data.linked_dataset_id || null,
        linked_risk_id: data.linked_risk_id || null,
        evidence_link: data.evidence_link || null,
      };

      await updateIncident({ id: incidentId, data: payload }).unwrap();
      router.push(`/governance/incidents`);
    } catch (error) {
      console.error("Failed to update AI incident:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <ResponseGovernanceStep />;
      case 3:
        return <ImpactAssessmentStep />;
      case 4:
        return <LinksEvidenceStep />;
      default:
        return null;
    }
  };

  if (isLoadingIncident) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading incident...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Incident not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="space-y-6 p-0">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Edit AI Incident
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                {incident.title}
              </p>
            </div>

            {hasCurrentStepErrors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form before continuing.
                </AlertDescription>
              </Alert>
            )}

            <MultiStepWizard
              steps={AI_INCIDENT_WIZARD_STEPS}
              currentStep={currentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit(handleFormSubmit)}
              isLoading={isLoading}
              submitLabel="Update Incident"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

export default EditAiIncidentWizard;

