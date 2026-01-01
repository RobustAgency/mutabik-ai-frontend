"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ResponseGovernanceStep } from "./steps/ResponseGovernanceStep";
import { ImpactAssessmentStep } from "./steps/ImpactAssessmentStep";
import { LinksEvidenceStep } from "./steps/LinksEvidenceStep";

interface AiIncidentModalFormProps {
  onSuccess: (createdItem: any) => void;
  onCancel: () => void;
}

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

const AiIncidentModalForm: React.FC<AiIncidentModalFormProps> = ({ onSuccess, onCancel }) => {
  const [createIncident, { isLoading }] = useCreateAiIncidentMutation();

  const methods = useForm<AiIncidentFormData>({
    resolver: zodResolver(aiIncidentSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

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

      const created = await createIncident(payload).unwrap();
      onSuccess(created);
    } catch (error) {
      console.error("Failed to create AI incident:", error);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create AI Incident</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {hasErrors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form before submitting.
                </AlertDescription>
              </Alert>
            )}

            <BasicInformationStep />
            <ResponseGovernanceStep />
            <ImpactAssessmentStep />
            <LinksEvidenceStep />

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
                {isLoading ? "Creating..." : "Create Incident"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AiIncidentModalForm;
