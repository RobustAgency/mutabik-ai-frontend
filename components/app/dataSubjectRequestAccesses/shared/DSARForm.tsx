"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  CreateDSARData,
  DataSubjectRequestAccess,
} from "@/interfaces/DataSubjectRequestAccess";
import {
  dataSubjectRequestAccessSchema,
  type DataSubjectRequestAccessFormData,
} from "@/lib/schemas/dataSubjectRequestAccess.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInfoStep } from "../create/steps/BasicInfoStep";
import { VerificationStep } from "../create/steps/VerificationStep";
import { RequestDetailsStep } from "../create/steps/RequestDetailsStep";
import { WorkflowResponseStep } from "../create/steps/WorkflowResponseStep";

const WIZARD_STEPS = [
  { id: 1, title: "Basic Information", description: "Request basics" },
  { id: 2, title: "Subject & Verification", description: "Subject & verification" },
  { id: 3, title: "Request Details", description: "Details & dates" },
  { id: 4, title: "Workflow & Response", description: "Status & response" },
];

const initialFormData: DataSubjectRequestAccessFormData = {
  request_type: "access",
  subject_identifier: "",
  subject_name: "",
  subject_realm: "customer",
  verification_status: "pending",
  subject_key: null,
  verification_method: null,
  verified_by: null,
  request_details: "",
  requested_data_categories: [],
  request_source: "web_form",
  submitted_date: "",
  due_date: "",
  extended_due_date: null,
  status: "new",
  response_date: null,
  completed_date: null,
  priority: "normal",
  is_overdue: false,
  assigned_to: "",
  assigned_date: "",
  response_method: null,
  response_format: null,
  response_uri: null,
  response_notes: null,
  rejection_reason: null,
  jurisdiction: "",
  processing_activity_ids: [],
  systems_checked: [],
  records_found: null,
};

// Fields for step-level validation
const stepFields: Record<number, (keyof DataSubjectRequestAccessFormData)[]> = {
  1: ["request_type", "subject_identifier", "subject_realm"],
  2: ["verification_status"],
  3: ["request_details", "request_source", "submitted_date", "due_date", "systems_checked"],
  4: ["status", "priority", "is_overdue", "assigned_to", "assigned_date", "jurisdiction"],
};

interface DSARFormProps {
  mode: "create" | "edit";
  initialData?: DataSubjectRequestAccess;
  isLoading?: boolean;
  onSubmit: (data: CreateDSARData | Partial<CreateDSARData>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
}

export const DSARForm: React.FC<DSARFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<DataSubjectRequestAccessFormData>({
    resolver: zodResolver(dataSubjectRequestAccessSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  // Populate form with existing data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        request_type: initialData.request_type,
        subject_identifier: initialData.subject_identifier,
        subject_name: initialData.subject_name,
        subject_realm: initialData.subject_realm,
        verification_status: initialData.verification_status,
        subject_key: initialData.subject_key,
        verification_method: initialData.verification_method,
        verified_by: initialData.verified_by
          ? String(initialData.verified_by)
          : null,
        request_details: initialData.request_details,
        requested_data_categories:
          initialData.requested_data_categories || [],
        request_source: initialData.request_source,
        submitted_date: initialData.submitted_date.split("T")[0],
        due_date: initialData.due_date.split("T")[0],
        extended_due_date: initialData.extended_due_date
          ? initialData.extended_due_date.split("T")[0]
          : null,
        status: initialData.status,
        response_date: initialData.response_date
          ? initialData.response_date.split("T")[0]
          : null,
        completed_date: initialData.completed_date
          ? initialData.completed_date.split("T")[0]
          : null,
        priority: initialData.priority,
        is_overdue: initialData.is_overdue,
        assigned_to: String(initialData.assigned_to),
        assigned_date: initialData.assigned_date.split("T")[0],
        response_method: initialData.response_method,
        response_format: initialData.response_format,
        response_uri: initialData.response_uri,
        response_notes: initialData.response_notes,
        rejection_reason: initialData.rejection_reason,
        jurisdiction: initialData.jurisdiction || "",
        processing_activity_ids: initialData.processing_activity_ids || [],
        systems_checked: Array.isArray(initialData.systems_checked)
          ? initialData.systems_checked
          : initialData.systems_checked
          ? [initialData.systems_checked]
          : [],
        records_found: initialData.records_found,
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
    const isCompleted = data.status === "completed";
    const isReadyForResponse = data.status === "ready_for_response";
    const isRejected = data.status === "rejected";
    const isVerified = data.verification_status === "verified";

    // Transform form data to API format
    const payload: CreateDSARData | Partial<CreateDSARData> = {
      request_type: data.request_type,
      subject_identifier: data.subject_identifier.trim(),
      subject_name: data.subject_name?.trim() || null,
      subject_realm: data.subject_realm,
      verification_status: data.verification_status,
      // Only include verification fields if verified
      ...(isVerified
        ? {
            subject_key: data.subject_key?.trim() || null,
            verification_method: data.verification_method || null,
            verified_by: data.verified_by ? Number(data.verified_by) : null,
          }
        : {}),
      request_details: data.request_details.trim(),
      requested_data_categories: data.requested_data_categories || [],
      request_source: data.request_source,
      submitted_date: data.submitted_date,
      due_date: data.due_date,
      // Only include extended_due_date if it's provided and valid
      ...(data.extended_due_date && data.extended_due_date.trim()
        ? { extended_due_date: data.extended_due_date }
        : {}),
      status: data.status,
      priority: data.priority,
      is_overdue: data.is_overdue,
      assigned_to: Number(data.assigned_to),
      assigned_date: data.assigned_date,
      // Only include response/completion fields if status is completed
      ...(isCompleted
        ? {
            response_date: data.response_date || null,
            completed_date: data.completed_date || null,
          }
        : {}),
      // Only include response fields if status is ready_for_response
      ...(isReadyForResponse
        ? {
            response_method: data.response_method || null,
            response_format: data.response_format || null,
            response_uri: data.response_uri?.trim() || null,
          }
        : {}),
      response_notes: data.response_notes?.trim() || null,
      // Jurisdiction is always required
      jurisdiction: data.jurisdiction?.trim() || "",
      // Only include rejection_reason if status is rejected
      ...(isRejected
        ? {
            rejection_reason: data.rejection_reason?.trim() || null,
          }
        : {}),
      // Only send valid numeric processing activity IDs
      processing_activity_ids: (data.processing_activity_ids || [])
        .filter((id) => id != null && !isNaN(Number(id)) && Number(id) > 0)
        .map((id) => Number(id)),
      systems_checked: data.systems_checked.filter((s) => s.trim().length > 0),
      records_found: data.records_found ?? null,
    };

    try {
      await onSubmit(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        // Handle backend validation errors
        Object.entries(err.data.errors).forEach(
          ([field, fieldErrors]: [string, any]) => {
            methods.setError(field as any, {
              type: "server",
              message: Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors,
            });
          }
        );
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
        return <BasicInfoStep />;
      case 2:
        return <VerificationStep />;
      case 3:
        return <RequestDetailsStep />;
      case 4:
        return <WorkflowResponseStep />;
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
              submitLabel={mode === "create" ? "Create DSAR" : "Update DSAR"}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
};


