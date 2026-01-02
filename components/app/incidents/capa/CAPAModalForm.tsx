"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CAPAForm from "./create/CAPAForm";
import { 
  CreateCorrectivePreventiveActionData, 
  useCreateCorrectivePreventiveActionMutation,
  SourceType,
  CapaType,
  Priority,
  OwnerTeam,
  Status,
  VerificationResult
} from "@/app/lib/features/correctivePreventiveActionsApi";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface CAPAModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: number;
}

const CAPAModalForm: React.FC<CAPAModalFormProps> = ({ isOpen, onClose, incidentId }) => {
  const [createCAPA, { isLoading }] = useCreateCorrectivePreventiveActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateCorrectivePreventiveActionData>({
    source_type: SourceType.INCIDENT,
    source_reference: incidentId ? String(incidentId) : "",
    ai_model_id: null,
    dataset_id: null,
    title: "",
    capa_type: CapaType.CORRECTIVE,
    priority: Priority.MEDIUM,
    owner_team: OwnerTeam.AI_GOVERNANCE,
    assignee: null,
    root_cause: null,
    actions: "",
    due_date: "",
    status: Status.NEW,
    verification_result: null,
    evidence_link: null,
  });

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      source_type: validateTextField(formData.source_type, { required: true, messages: { required: "Source type is required" } }),
      source_reference: validateTextField(formData.source_reference, { required: true, messages: { required: "Source reference is required" } }),
      title: validateTextField(formData.title, { required: true, messages: { required: "Title is required" } }),
      capa_type: validateTextField(formData.capa_type, { required: true, messages: { required: "CAPA type is required" } }),
      priority: validateTextField(formData.priority, { required: true, messages: { required: "Priority is required" } }),
      owner_team: validateTextField(formData.owner_team, { required: true, messages: { required: "Owner team is required" } }),
      actions: validateTextField(formData.actions, { required: true, messages: { required: "Actions is required" } }),
      due_date: validateTextField(formData.due_date, { required: true, messages: { required: "Due date is required" } }),
      status: validateTextField(formData.status, { required: true, messages: { required: "Status is required" } }),
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
      await createCAPA(formData).unwrap();
      onClose();
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Corrective/Preventive Action</DialogTitle>
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
          <CAPAForm formData={formData} setFormData={setFormData} errors={errors} />
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
              {isLoading ? "Creating..." : "Create CAPA"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CAPAModalForm;

