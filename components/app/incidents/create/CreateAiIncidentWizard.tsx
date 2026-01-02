"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { aiIncidentSchema, type AiIncidentFormData } from "@/lib/schemas/aiIncident.schema";
import {
  useCreateAiIncidentMutation,
  CreateAiIncidentData,
  IncidentType,
  Domain,
  IncidentSeverity,
  IncidentStatus,
  ResponseTeam,
  PrimaryRegulatoryFramework,
  NotificationRequirement,
} from "@/app/lib/features/aiIncidentsApi";
import { AI_INCIDENT_WIZARD_STEPS } from "../constants";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ResponseGovernanceStep } from "./steps/ResponseGovernanceStep";
import { ImpactAssessmentStep } from "./steps/ImpactAssessmentStep";
import { LinksEvidenceStep } from "./steps/LinksEvidenceStep";

const initialFormData: Partial<AiIncidentFormData> = {
  title: "",
  summary: "",
  incident_type: IncidentType.OTHER,
  domain: Domain.AI_GOVERNANCE,
  severity: IncidentSeverity.SEV3_MEDIUM,
  status: IncidentStatus.OPEN,
  incident_commander: "",
  response_team: ResponseTeam.AI_GOVERNANCE,
  primary_regulatory_framework: PrimaryRegulatoryFramework.NA,
  notification_requirement: NotificationRequirement.UNDER_ASSESSMENT,
  data_residency_affected: null,
  regulatory_reference: null,
  estimated_impacted_users: null,
  estimated_impacted_records: 0,
  data_types_impacted: [],
  affected_business_units: null,
  external_parties_involved: null,
  business_impact_description: null,
  impacted_systems: null,
  ai_model_id: null,
  linked_dataset_id: null,
  linked_risk_id: null,
  evidence_link: null,
};

const CreateAiIncidentWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createIncident, { isLoading }] = useCreateAiIncidentMutation();

  const methods = useForm<AiIncidentFormData>({
    resolver: zodResolver(aiIncidentSchema) as any,
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
        // All fields optional in step 4
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
      const payload: CreateAiIncidentData = {
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

      await createIncident(payload).unwrap();
      router.push("/governance/incidents");
    } catch (error) {
      console.error("Failed to create AI incident:", error);
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

  return (
    <FormProvider {...methods}>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="space-y-6 p-0">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Declare AI Incident
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                Create a new incident or near-miss record
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
              submitLabel="Declare Incident"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

export default CreateAiIncidentWizard;

