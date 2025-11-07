"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AiIncidentForm from "./AiIncidentForm";
import {
  CreateAiIncidentData,
  useCreateAiIncidentMutation,
} from "@/app/lib/features/aiIncidentsApi";

interface AiIncidentModalFormProps {
  onSuccess: (createdItem: any) => void;
  onCancel: () => void;
}

const AiIncidentModalForm: React.FC<AiIncidentModalFormProps> = ({ onSuccess, onCancel }) => {
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
    const validationErrors: Record<string, string[]> = {};

    if (!formData.title?.trim()) validationErrors.title = ["Title is required"];
    if (!formData.summary?.trim()) validationErrors.summary = ["Summary is required"];
    if (!formData.category?.trim()) validationErrors.category = ["Category is required"];
    if (!formData.severity?.trim()) validationErrors.severity = ["Severity is required"];
    if (!formData.status?.trim()) validationErrors.status = ["Status is required"];
    if (!formData.stage?.trim()) validationErrors.stage = ["Stage is required"];
    if (!formData.ic_owner?.trim()) validationErrors.ic_owner = ["Incident commander is required"];
    if (!formData.first_seen_at?.trim()) validationErrors.first_seen_at = ["First seen at is required"];
    if (!formData.declared_at?.trim()) validationErrors.declared_at = ["Declared at is required"];
    if (!formData.impacted_data || formData.impacted_data.length === 0) {
      validationErrors.impacted_data = ["At least one impacted data type is required"];
    }

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
      const created = await createIncident(formData).unwrap();
      onSuccess(created);
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create AI Incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-4">
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
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
              {isLoading ? "Creating..." : "Create Incident"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiIncidentModalForm;


