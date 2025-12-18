"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  ConsentRecord,
  CreateConsentRecordData,
} from "@/interfaces/ConsentRecord";
import {
  consentRecordSchema,
  type ConsentRecordFormData,
} from "@/lib/schemas/consentRecord.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInfoStep } from "../steps/BasicInfoStep";
import { ConsentDetailsStep } from "../steps/ConsentDetailsStep";
import { MetadataStep } from "../steps/MetadataStep";

const WIZARD_STEPS = [
  { id: 1, title: "Subject & Purpose", description: "Subject & processing link" },
  { id: 2, title: "Consent Details", description: "Text, status & lifecycle" },
  { id: 3, title: "Metadata", description: "Evidence & technical details" },
];

const initialFormData: ConsentRecordFormData = {
  subject_key: "",
  subject_realm: "customer",
  subject_age_group: "",
  purpose: "marketing",
  record_of_processing_activity_id: 0,
  status: "granted",
  lifecycle_stage: "obtained",
  consent_version: 1,
  consent_text: "",
  consent_method: "explicit_opt_in",
  effective_from: "",
  effective_to: null,
  last_refreshed_date: null,
  source_system: "website",
  evidence_uri: null,
  ip_address: null,
  user_agent: null,
  language: "en",
  jurisdiction: "eu",
  data_categories: [],
  can_withdraw: true,
  withdrawal_method: "",
};

const stepFields: Record<number, (keyof ConsentRecordFormData)[]> = {
  1: ["subject_key", "subject_realm", "purpose", "record_of_processing_activity_id"],
  2: [
    "status",
    "lifecycle_stage",
    "consent_version",
    "consent_text",
    "consent_method",
    "effective_from",
  ],
  3: [
    "source_system",
    "language",
    "jurisdiction",
    "data_categories",
    "withdrawal_method",
  ],
};

interface ConsentRecordFormProps {
  mode: "create" | "edit";
  initialData?: ConsentRecord;
  isLoading?: boolean;
  onSubmit: (
    data: CreateConsentRecordData | Partial<CreateConsentRecordData>
  ) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
}

export const ConsentRecordForm: React.FC<ConsentRecordFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<ConsentRecordFormData>({
    resolver: zodResolver(consentRecordSchema) as any,
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
        subject_key: initialData.subject_key,
        subject_realm: initialData.subject_realm,
        subject_age_group: initialData.subject_age_group || "",
        purpose: initialData.purpose,
        record_of_processing_activity_id:
          initialData.record_of_processing_activity_id,
        status: initialData.status,
        lifecycle_stage: initialData.lifecycle_stage,
        consent_version: initialData.consent_version,
        consent_text: initialData.consent_text,
        consent_method: initialData.consent_method,
        effective_from: initialData.effective_from.split("T")[0],
        effective_to: initialData.effective_to
          ? initialData.effective_to.split("T")[0]
          : null,
        last_refreshed_date: initialData.last_refreshed_date
          ? initialData.last_refreshed_date.split("T")[0]
          : null,
        source_system: initialData.source_system,
        evidence_uri: initialData.evidence_uri,
        ip_address: initialData.ip_address,
        user_agent: initialData.user_agent,
        language: initialData.language,
        jurisdiction: initialData.jurisdiction,
        data_categories: initialData.data_categories,
        can_withdraw: initialData.can_withdraw,
        withdrawal_method: initialData.withdrawal_method,
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
    const payload: CreateConsentRecordData | Partial<CreateConsentRecordData> = {
      subject_key: data.subject_key.trim(),
      subject_realm: data.subject_realm,
      subject_age_group: data.subject_age_group?.trim() || null,
      purpose: data.purpose,
      record_of_processing_activity_id: data.record_of_processing_activity_id,
      status: data.status,
      lifecycle_stage: data.lifecycle_stage,
      consent_version: data.consent_version,
      consent_text: data.consent_text.trim(),
      consent_method: data.consent_method,
      effective_from: data.effective_from,
      effective_to: data.effective_to || null,
      last_refreshed_date: data.last_refreshed_date || null,
      source_system: data.source_system,
      evidence_uri: data.evidence_uri?.trim() || null,
      ip_address: data.ip_address?.trim() || null,
      user_agent: data.user_agent?.trim() || null,
      language: data.language,
      jurisdiction: data.jurisdiction,
      data_categories: data.data_categories,
      can_withdraw: data.can_withdraw,
      withdrawal_method: data.withdrawal_method.trim(),
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

  const validationErrors: Record<string, string[]> = {};
  Object.entries(errors).forEach(([key, error]) => {
    if (error?.message) {
      validationErrors[key] = [error.message as string];
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <ConsentDetailsStep />;
      case 3:
        return <MetadataStep />;
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
                  <p className="font-semibold mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(
                      ([field, fieldErrors]) => (
                        <li key={field}>
                          <span className="font-medium capitalize">
                            {field.replace(/_/g, " ")}:
                          </span>{" "}
                          {fieldErrors[0]}
                        </li>
                      )
                    )}
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


