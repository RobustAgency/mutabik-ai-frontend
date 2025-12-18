"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateROPAData } from "@/interfaces/RecordOfProcessingActivity";
import type { RecordOfProcessingActivity } from "@/interfaces/RecordOfProcessingActivity";
import {
  recordOfProcessingActivitySchema,
  type RecordOfProcessingActivityFormData,
} from "@/lib/schemas/recordOfProcessingActivity.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { DataCategoriesStep } from "../create/steps/DataCategoriesStep";
import { LegalBasisStep } from "../create/steps/LegalBasisStep";
import { RetentionSecurityStep } from "../create/steps/RetentionSecurityStep";
import { InternationalTransfersStep } from "../create/steps/InternationalTransfersStep";
import { DPIAReviewStep } from "../create/steps/DPIAReviewStep";

const WIZARD_STEPS = [
  { id: 1, title: "Basic Information", description: "Core details" },
  { id: 2, title: "Data Categories", description: "Data subjects & categories" },
  { id: 3, title: "Legal Basis", description: "Lawful basis & consent" },
  { id: 4, title: "Retention & Security", description: "Retention & security measures" },
  { id: 5, title: "International Transfers", description: "Jurisdictions & recipients" },
  { id: 6, title: "DPIA & Review", description: "DPIA info & review schedule" },
];

const initialFormData: RecordOfProcessingActivityFormData = {
  activity_code: "",
  activity_name: "",
  purpose: "",
  detailed_purpose: null,
  owner_team: "hr",
  controller_role: "controller",
  status: "draft",
  data_subject_categories: [],
  data_categories: [],
  contains_pii: false,
  consent_required: false,
  lawful_basis: "consent",
  legitimate_interest_assessment: null,
  consent_coverage_percent: null,
  dpia_required: false,
  dpia_status: null,
  dpia_id: null,
  retention_period: "",
  retention_justification: "",
  has_international_transfers: false,
  applicable_jurisdictions: [],
  linked_dataset_ids: [],
  linked_ai_models_ids: [],
  security_measures: "",
  internal_recipients: [],
  external_recipients: [],
  last_reviewed_date: null,
  next_review_date: null,
};

// Field names for each step validation
const stepFields: Record<number, (keyof RecordOfProcessingActivityFormData)[]> = {
  1: ["activity_code", "activity_name", "purpose", "owner_team", "controller_role", "status"],
  2: ["data_subject_categories", "data_categories"],
  3: ["lawful_basis"],
  4: ["retention_period", "retention_justification", "security_measures"],
  5: ["applicable_jurisdictions"],
  6: [], // Step 6 has no required fields
};

interface ROPAFormProps {
  mode: "create" | "edit";
  initialData?: RecordOfProcessingActivity;
  isLoading?: boolean;
  onSubmit: (data: CreateROPAData | Partial<CreateROPAData>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
}

export const ROPAForm: React.FC<ROPAFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<RecordOfProcessingActivityFormData>({
    resolver: zodResolver(recordOfProcessingActivitySchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const { handleSubmit, trigger, formState: { errors }, reset } = methods;

  // Populate form with existing data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        activity_code: initialData.activity_code,
        activity_name: initialData.activity_name,
        purpose: initialData.purpose,
        detailed_purpose: initialData.detailed_purpose,
        owner_team: initialData.owner_team as any,
        controller_role: initialData.controller_role as any,
        status: initialData.status as any,
        data_subject_categories: initialData.data_subject_categories as any,
        data_categories: initialData.data_categories as any,
        contains_pii: initialData.contains_pii,
        consent_required: initialData.consent_required,
        lawful_basis: initialData.lawful_basis as any,
        legitimate_interest_assessment: initialData.legitimate_interest_assessment,
        consent_coverage_percent: initialData.consent_coverage_percent,
        dpia_required: initialData.dpia_required,
        dpia_status: initialData.dpia_status as any,
        dpia_id: initialData.dpia_id,
        retention_period: initialData.retention_period,
        retention_justification: initialData.retention_justification,
        has_international_transfers: initialData.has_international_transfers,
        applicable_jurisdictions: initialData.applicable_jurisdictions as any,
        linked_dataset_ids: initialData.linked_dataset_ids,
        linked_ai_models_ids: initialData.linked_ai_models_ids,
        security_measures: initialData.security_measures,
        internal_recipients: initialData.internal_recipients,
        external_recipients: initialData.external_recipients,
        last_reviewed_date: initialData.last_reviewed_date
          ? initialData.last_reviewed_date.split("T")[0]
          : null,
        next_review_date: initialData.next_review_date
          ? initialData.next_review_date.split("T")[0]
          : null,
      });
    }
  }, [mode, initialData, reset]);

  const handleValidateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = stepFields[step];
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
    // Transform form data to API format
    const payload: CreateROPAData | Partial<CreateROPAData> = {
      activity_code: data.activity_code.trim(),
      activity_name: data.activity_name.trim(),
      purpose: data.purpose.trim(),
      detailed_purpose: data.detailed_purpose?.trim() || null,
      owner_team: data.owner_team,
      controller_role: data.controller_role,
      data_subject_categories: data.data_subject_categories,
      data_categories: data.data_categories,
      contains_pii: data.contains_pii || false,
      consent_required: data.consent_required || false,
      lawful_basis: data.lawful_basis,
      legitimate_interest_assessment: data.legitimate_interest_assessment?.trim() || null,
      // Only include consent_coverage_percent if consent is required
      ...(data.consent_required
        ? {
            consent_coverage_percent:
              data.consent_coverage_percent &&
              !isNaN(data.consent_coverage_percent) &&
              data.consent_coverage_percent >= 0 &&
              data.consent_coverage_percent <= 100
                ? data.consent_coverage_percent
                : null,
          }
        : {}),
      dpia_required: data.dpia_required || false,
      // Only include dpia_status and dpia_id if DPIA is required
      ...(data.dpia_required
        ? {
            dpia_status: data.dpia_status || null,
            dpia_id:
              data.dpia_id && !isNaN(data.dpia_id) && data.dpia_id > 0
                ? data.dpia_id
                : null,
          }
        : {}),
      retention_period: data.retention_period.trim(),
      retention_justification: data.retention_justification.trim(),
      has_international_transfers: data.has_international_transfers || false,
      applicable_jurisdictions: data.applicable_jurisdictions,
      linked_dataset_ids: data.linked_dataset_ids || [],
      linked_ai_models_ids: data.linked_ai_models_ids || [],
      security_measures: data.security_measures.trim(),
      internal_recipients: data.internal_recipients || [],
      external_recipients: data.external_recipients || [],
      status: data.status,
      last_reviewed_date: data.last_reviewed_date
        ? `${data.last_reviewed_date}T00:00:00Z`
        : null,
      next_review_date: data.next_review_date
        ? `${data.next_review_date}T00:00:00Z`
        : null,
    };

    try {
      await onSubmit(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        // Handle backend validation errors
        Object.entries(err.data.errors).forEach(([field, fieldErrors]: [string, any]) => {
          methods.setError(field as any, {
            type: "server",
            message: Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors,
          });
        });
        // Navigate to first step with errors
        for (let step = 1; step <= WIZARD_STEPS.length; step++) {
          const stepFieldsToCheck = stepFields[step];
          const hasError = stepFieldsToCheck.some((field) => errors[field]);
          if (hasError) {
            setCurrentStep(step);
            break;
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });

  // Convert React Hook Form errors to the format expected by components
  const validationErrors: Record<string, string[]> = {};
  Object.entries(errors).forEach(([key, error]) => {
    if (error?.message) {
      validationErrors[key] = [error.message as string];
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <DataCategoriesStep />;
      case 3:
        return <LegalBasisStep />;
      case 4:
        return <RetentionSecurityStep />;
      case 5:
        return <InternationalTransfersStep />;
      case 6:
        return <DPIAReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FormProvider {...methods}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="mb-6">
            <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
              {title}
            </h1>
            <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
              {description}
            </p>
          </div>

          <CardContent className="space-y-8 w-full p-0">
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, fieldErrors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {fieldErrors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <MultiStepWizard
              currentStep={currentStep}
              steps={WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
};

