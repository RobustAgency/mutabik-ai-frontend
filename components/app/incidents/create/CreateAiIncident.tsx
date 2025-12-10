"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import AiIncidentForm from "./AiIncidentForm";
import {
  CreateAiIncidentData,
  useCreateAiIncidentMutation,
} from "@/app/lib/features/aiIncidentsApi";
import {
  validateTextField,
  validateArrayField,
  createValidationErrors,
} from "@/lib/utils/validation";

const CreateAiIncident: React.FC = () => {
  const router = useRouter();
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
      title: validateTextField(formData.title, { required: true, messages: { required: "Title is required" } }),
      summary: validateTextField(formData.summary, { required: true, messages: { required: "Summary is required" } }),
      category: validateTextField(formData.category, { required: true, messages: { required: "Category is required" } }),
      severity: validateTextField(formData.severity, { required: true, messages: { required: "Severity is required" } }),
      status: validateTextField(formData.status, { required: true, messages: { required: "Status is required" } }),
      stage: validateTextField(formData.stage, { required: true, messages: { required: "Stage is required" } }),
      ic_owner: validateTextField(formData.ic_owner, { required: true, messages: { required: "Incident commander is required" } }),
      first_seen_at: validateTextField(formData.first_seen_at, { required: true, messages: { required: "First seen at is required" } }),
      declared_at: validateTextField(formData.declared_at, { required: true, messages: { required: "Declared at is required" } }),
      impacted_data: validateArrayField(formData.impacted_data, {
        required: true,
        messages: { required: "At least one impacted data type is required" },
      }),
    };

    const errors = createValidationErrors(fieldErrors);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createIncident(formData).unwrap();
      router.push("/governance/incidents");
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Declare AI Incident
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new incident or near-miss record
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Creating..." : "Declare Incident"}
            </Button>
          </div>
          <CardContent>
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, fieldErrors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {fieldErrors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <AiIncidentForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateAiIncident;

