"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  PrivacyIncident,
  CreatePrivacyIncidentData,
} from "@/interfaces/PrivacyIncident";
import {
  privacyIncidentSchema,
  type PrivacyIncidentFormData,
} from "@/lib/schemas/privacyIncident.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { IncidentDetailsStep } from "../create/steps/IncidentDetailsStep";
import { NotificationStep } from "../create/steps/NotificationStep";
import { ResponseResolutionStep } from "../create/steps/ResponseResolutionStep";
import { RelatedInformationStep } from "../create/steps/RelatedInformationStep";

const WIZARD_STEPS = [
  { id: 1, title: "Basic Information", description: "Incident basics & breach status" },
  { id: 2, title: "Incident Details", description: "What happened & data affected" },
  { id: 3, title: "Notification", description: "Authority & subject notifications" },
  { id: 4, title: "Response & Resolution", description: "Actions & resolution" },
  { id: 5, title: "Related Information", description: "Links & evidence" },
];

const initialFormData: PrivacyIncidentFormData = {
  incident_title: "",
  incident_type: "unauthorized_access",
  risk_level: "medium",
  is_breach: false,
  breach_criteria_met: null,
  detected_date: "",
  occurred_date: null,
  hours_to_deadline: null,
  is_deadline_passed: false,
  incident_description: "",
  what_happened: "",
  how_discovered: "",
  data_compromised: "",
  data_categories_affected: [],
  estimated_affected_subjects: 0,
  affected_subject_keys: null,
  notification_required: "none",
  notification_status: "pending",
  authority_notified: false,
  authority_notification_date: null,
  supervisory_authority: null,
  authority_reference_number: null,
  authority_response: null,
  subjects_notified: false,
  subject_notification_date: null,
  notification_method: null,
  notification_template_used: null,
  immediate_actions: "",
  mitigation_measures: "",
  preventive_measures: "",
  root_cause_analysis: null,
  responsible_party: null,
  lessons_learned: null,
  status: "detected",
  resolution_date: null,
  processing_activity_ids: null,
  affected_systems: [] as string[],
  third_party_involved: false,
  vendor_id: null,
  evidence_uris: [] as string[],
};

const stepFields: Record<number, (keyof PrivacyIncidentFormData)[]> = {
  1: ["incident_title", "incident_type", "risk_level", "is_breach", "detected_date"],
  2: ["incident_description", "what_happened", "how_discovered", "data_compromised", "data_categories_affected", "estimated_affected_subjects"],
  3: ["notification_required", "notification_status", "authority_notified", "subjects_notified"],
  4: ["immediate_actions", "mitigation_measures", "preventive_measures", "status"],
  5: ["affected_systems", "third_party_involved"],
};

interface PrivacyIncidentFormProps {
  mode: "create" | "edit";
  initialData?: PrivacyIncident;
  isLoading?: boolean;
  onSubmit: (data: CreatePrivacyIncidentData | Partial<CreatePrivacyIncidentData>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const PrivacyIncidentForm: React.FC<PrivacyIncidentFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
  hideHeader = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<PrivacyIncidentFormData>({
    resolver: zodResolver(privacyIncidentSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        incident_title: initialData.incident_title,
        incident_type: initialData.incident_type,
        risk_level: initialData.risk_level,
        is_breach: initialData.is_breach,
        breach_criteria_met: initialData.breach_criteria_met || null,
        detected_date: initialData.detected_date.split("T")[0],
        occurred_date: initialData.occurred_date
          ? initialData.occurred_date.split("T")[0]
          : null,
        hours_to_deadline: initialData.hours_to_deadline,
        is_deadline_passed: initialData.is_deadline_passed,
        incident_description: initialData.incident_description,
        what_happened: initialData.what_happened,
        how_discovered: initialData.how_discovered,
        data_compromised: initialData.data_compromised,
        data_categories_affected: initialData.data_categories_affected,
        estimated_affected_subjects: initialData.estimated_affected_subjects,
        affected_subject_keys: initialData.affected_subject_keys || null,
        notification_required: initialData.notification_required,
        notification_status: initialData.notification_status,
        authority_notified: initialData.authority_notified,
        authority_notification_date: initialData.authority_notification_date
          ? initialData.authority_notification_date.split("T")[0]
          : null,
        supervisory_authority: initialData.supervisory_authority || null,
        authority_reference_number: initialData.authority_reference_number || null,
        authority_response: initialData.authority_response || null,
        subjects_notified: initialData.subjects_notified,
        subject_notification_date: initialData.subject_notification_date
          ? initialData.subject_notification_date.split("T")[0]
          : null,
        notification_method: initialData.notification_method || null,
        notification_template_used: initialData.notification_template_used || null,
        immediate_actions: initialData.immediate_actions,
        mitigation_measures: initialData.mitigation_measures,
        preventive_measures: initialData.preventive_measures,
        root_cause_analysis: initialData.root_cause_analysis || null,
        responsible_party: initialData.responsible_party || null,
        lessons_learned: initialData.lessons_learned || null,
        status: initialData.status,
        resolution_date: initialData.resolution_date
          ? initialData.resolution_date.split("T")[0]
          : null,
        processing_activity_ids: Array.isArray(initialData.processing_activity_ids) && initialData.processing_activity_ids.length > 0
          ? (initialData.processing_activity_ids as number[]).slice()
          : null,
        affected_systems: initialData.affected_systems || [],
        third_party_involved: initialData.third_party_involved,
        vendor_id: initialData.vendor_id || null,
        evidence_uris: initialData.evidence_uris || ([] as string[]),
      });
    }
  }, [mode, initialData, reset]);

  const handleValidateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = stepFields[step];
    
    // Special handling for step 1 (Basic Information)
    if (step === 1) {
      const isBreach = methods.getValues("is_breach");
      
      const fieldsToCheck: (keyof PrivacyIncidentFormData)[] = [
        ...fieldsToValidate,
      ];
      
      if (isBreach) {
        fieldsToCheck.push("breach_criteria_met");
      }
      
      const isValid = await trigger(fieldsToCheck as any);
      return isValid;
    }
    
    // Special handling for step 3 (Notification)
    if (step === 3) {
      const authorityNotified = methods.getValues("authority_notified");
      const subjectsNotified = methods.getValues("subjects_notified");
      
      const fieldsToCheck: (keyof PrivacyIncidentFormData)[] = [
        "notification_required",
        "notification_status",
      ];
      
      if (authorityNotified) {
        fieldsToCheck.push("authority_notification_date", "supervisory_authority");
      }
      
      if (subjectsNotified) {
        fieldsToCheck.push("subject_notification_date", "notification_method");
      }
      
      const isValid = await trigger(fieldsToCheck as any);
      return isValid;
    }
    
    // Special handling for step 4 (Response & Resolution)
    if (step === 4) {
      const status = methods.getValues("status");
      
      const fieldsToCheck: (keyof PrivacyIncidentFormData)[] = [
        ...fieldsToValidate,
      ];
      
      if (status === "resolved") {
        fieldsToCheck.push("root_cause_analysis", "lessons_learned", "resolution_date");
      }
      
      const isValid = await trigger(fieldsToCheck as any);
      return isValid;
    }
    
    // Special handling for step 5 (Related Information)
    if (step === 5) {
      const thirdPartyInvolved = methods.getValues("third_party_involved");
      
      const fieldsToCheck: (keyof PrivacyIncidentFormData)[] = [
        ...fieldsToValidate,
      ];
      
      if (thirdPartyInvolved) {
        fieldsToCheck.push("vendor_id");
      }
      
      const isValid = await trigger(fieldsToCheck as any);
      return isValid;
    }
    
    if (fieldsToValidate.length === 0) return true;

    const isValid = await trigger(fieldsToValidate as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await handleValidateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const isBreach = data.is_breach;
    const authorityNotified = data.authority_notified;
    const subjectsNotified = data.subjects_notified;
    const status = data.status;
    const thirdPartyInvolved = data.third_party_involved;

    const payload: CreatePrivacyIncidentData | Partial<CreatePrivacyIncidentData> = {
      incident_title: data.incident_title.trim(),
      incident_type: data.incident_type,
      risk_level: data.risk_level,
      is_breach: data.is_breach,
      ...(isBreach && data.breach_criteria_met && data.breach_criteria_met.length > 0
        ? { breach_criteria_met: data.breach_criteria_met }
        : {}),
      detected_date: data.detected_date,
      occurred_date: data.occurred_date || null,
      hours_to_deadline: data.hours_to_deadline || null,
      is_deadline_passed: data.is_deadline_passed,
      incident_description: data.incident_description.trim(),
      what_happened: data.what_happened.trim(),
      how_discovered: data.how_discovered.trim(),
      data_compromised: data.data_compromised.trim(),
      data_categories_affected: data.data_categories_affected,
      estimated_affected_subjects: data.estimated_affected_subjects,
      affected_subject_keys: data.affected_subject_keys && data.affected_subject_keys.length > 0
        ? data.affected_subject_keys
        : null,
      notification_required: data.notification_required,
      notification_status: data.notification_status,
      authority_notified: data.authority_notified,
      ...(authorityNotified
        ? {
            authority_notification_date: data.authority_notification_date || null,
            supervisory_authority: data.supervisory_authority?.trim() || null,
            authority_reference_number: data.authority_reference_number?.trim() || null,
            authority_response: data.authority_response?.trim() || null,
          }
        : {}),
      subjects_notified: data.subjects_notified,
      ...(subjectsNotified
        ? {
            subject_notification_date: data.subject_notification_date || null,
            notification_method: data.notification_method || null,
            notification_template_used: data.notification_template_used?.trim() || null,
          }
        : {}),
      immediate_actions: data.immediate_actions.trim(),
      mitigation_measures: data.mitigation_measures.trim(),
      preventive_measures: data.preventive_measures.trim(),
      ...(status === "resolved"
        ? {
            root_cause_analysis: data.root_cause_analysis?.trim() || null,
            lessons_learned: data.lessons_learned?.trim() || null,
            resolution_date: data.resolution_date || null,
          }
        : {}),
      responsible_party: data.responsible_party?.trim() || null,
      status: data.status,
      processing_activity_ids: data.processing_activity_ids && data.processing_activity_ids.length > 0
        ? data.processing_activity_ids
        : null,
      affected_systems: data.affected_systems.filter((s) => s.trim().length > 0),
      third_party_involved: data.third_party_involved,
      ...(thirdPartyInvolved && data.vendor_id
        ? { vendor_id: data.vendor_id }
        : {}),
      evidence_uris: data.evidence_uris && data.evidence_uris.length > 0
        ? data.evidence_uris.filter((uri) => uri.trim().length > 0)
        : null,
    };

    try {
      await onSubmit(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(
          ([field, fieldErrors]: [string, any]) => {
            methods.setError(field as any, {
              type: "server",
              message: Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors,
            });
          }
        );
      }
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <IncidentDetailsStep />;
      case 3:
        return <NotificationStep />;
      case 4:
        return <ResponseResolutionStep />;
      case 5:
        return <RelatedInformationStep />;
      default:
        return null;
    }
  };

  const containerClassName = hideHeader
    ? "w-full"
    : "max-w-7xl mx-auto";
  
  const cardClassName = hideHeader
    ? "p-4 border-[#E4E7EC] shadow-none"
    : "p-6 border-[#E4E7EC] shadow-none";

  return (
    <FormProvider {...methods}>
      <div className={containerClassName}>
        <Card className={cardClassName}>
          <CardContent className={hideHeader ? "p-0" : "space-y-6"}>
            {!hideHeader && (
              <div>
                <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                  {title}
                </h1>
                <p className="font-sans text-sm text-[#667085] mt-1">
                  {description}
                </p>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form before submitting.
                </AlertDescription>
              </Alert>
            )}

            <MultiStepWizard
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              submitLabel={mode === "create" ? "Create Incident" : "Update Incident"}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

