"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import IncidentActionForm from "./IncidentActionForm";
import { CreateIncidentActionData, useCreateIncidentActionMutation } from "@/app/lib/features/incidentActionsApi";

const CreateIncidentAction: React.FC = () => {
  const router = useRouter();
  const [createAction, { isLoading }] = useCreateIncidentActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentActionData>({
    ai_incident_id: 0,
    action_type: "kill_switch",
    description: "",
    performed_by: "",
    started_at: "",
    completed_at: null,
    validation_result: "pending",
    validation_notes: null,
    linked_release_id: null,
    evidence_link: null,
  });

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string[]> = {};

    if (!formData.ai_incident_id) validationErrors.ai_incident_id = ["Incident is required"];
    if (!formData.action_type?.trim()) validationErrors.action_type = ["Action type is required"];
    if (!formData.description?.trim()) validationErrors.description = ["Description is required"];
    if (!formData.performed_by?.trim()) validationErrors.performed_by = ["Performed by is required"];
    if (!formData.started_at?.trim()) validationErrors.started_at = ["Started at is required"];
    if (!formData.validation_result?.trim()) validationErrors.validation_result = ["Validation result is required"];

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createAction(formData).unwrap();
      router.push("/governance/incidents/actions");
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
                Create Incident Action
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new incident action
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Creating..." : "Create Action"}
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
            <IncidentActionForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentAction;

