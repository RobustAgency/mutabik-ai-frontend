"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AiIncidentForm from "./AiIncidentForm";
import {
  useCreateAiIncidentMutation,
  CreateAiIncidentData,
} from "@/app/lib/features/aiIncidentsApi";
import {
  validateTextField,
  validateArrayField,
  createValidationErrors,
} from "@/lib/utils/validation";

// AI Incident Modal Form Adapter for SelectWithInlineCreate
const AiIncidentModalFormAdapter: React.FC<{
  onSuccess: (item: any) => void;
  onCancel: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [createIncident, { isLoading }] = useCreateAiIncidentMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateAiIncidentData>({
    title: "",
    summary: "",
    category: "safety",
    severity: "sev3_medium",
    status: "open",
    stage: "prod",
    ic_owner: "",
    model_id: null,
    model_version_id: null,
    use_case_id: null,
    first_seen_at: "",
    declared_at: "",
    resolved_at: null,
    closed_at: null,
    impacted_users: null,
    impacted_data: [],
    impacted_systems: null,
    linked_release_id: null,
    linked_risk_id: null,
    linked_assessment_id: null,
    linked_capa_id: null,
    evidence_link: null,
  });

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      title: validateTextField(formData.title, {
        required: true,
        messages: { required: "Title is required" },
      }),
      summary: validateTextField(formData.summary, {
        required: true,
        messages: { required: "Summary is required" },
      }),
      category: validateTextField(formData.category, {
        required: true,
        messages: { required: "Category is required" },
      }),
      severity: validateTextField(formData.severity, {
        required: true,
        messages: { required: "Severity is required" },
      }),
      status: validateTextField(formData.status, {
        required: true,
        messages: { required: "Status is required" },
      }),
      stage: validateTextField(formData.stage, {
        required: true,
        messages: { required: "Stage is required" },
      }),
      ic_owner: validateTextField(formData.ic_owner, {
        required: true,
        messages: { required: "Incident commander is required" },
      }),
      first_seen_at: validateTextField(formData.first_seen_at, {
        required: true,
        messages: { required: "First seen at is required" },
      }),
      declared_at: validateTextField(formData.declared_at, {
        required: true,
        messages: { required: "Declared at is required" },
      }),
      impacted_data: validateArrayField(formData.impacted_data, {
        required: true,
        messages: { required: "At least one impacted data type is required" },
      }),
    };

    const validationErrors = createValidationErrors(fieldErrors);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createIncident(formData).unwrap();
      onSuccess(result);
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, fieldErrors]) => (
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
      <AiIncidentForm formData={formData} setFormData={setFormData} errors={errors} />
      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
          {isLoading ? "Creating..." : "Create Incident"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AiIncidentModalFormAdapter;

