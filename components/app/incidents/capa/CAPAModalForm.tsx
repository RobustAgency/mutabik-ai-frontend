"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CAPAForm from "./create/CAPAForm";
import { CreateCorrectivePreventiveActionData, useCreateCorrectivePreventiveActionMutation } from "@/app/lib/features/correctivePreventiveActionsApi";

interface CAPAModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: number;
}

const CAPAModalForm: React.FC<CAPAModalFormProps> = ({ isOpen, onClose, incidentId }) => {
  const [createCAPA, { isLoading }] = useCreateCorrectivePreventiveActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateCorrectivePreventiveActionData>({
    source_type: "incident",
    source_id: incidentId ? String(incidentId) : "",
    model_id: null,
    title: "",
    capa_type: "corrective",
    priority: "medium",
    owner_team: "product_ops",
    assignee: null,
    root_cause: null,
    actions: null,
    due_date: "",
    status: "new",
    verification_result: "pending",
    evidence_link: null,
  });

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string[]> = {};

    if (!formData.source_type?.trim()) validationErrors.source_type = ["Source type is required"];
    if (!formData.source_id?.trim()) validationErrors.source_id = ["Source ID is required"];
    if (!formData.title?.trim()) validationErrors.title = ["Title is required"];
    if (!formData.capa_type?.trim()) validationErrors.capa_type = ["CAPA type is required"];
    if (!formData.priority?.trim()) validationErrors.priority = ["Priority is required"];
    if (!formData.owner_team?.trim()) validationErrors.owner_team = ["Owner team is required"];
    if (!formData.due_date?.trim()) validationErrors.due_date = ["Due date is required"];
    if (!formData.status?.trim()) validationErrors.status = ["Status is required"];
    if (!formData.verification_result?.trim()) validationErrors.verification_result = ["Verification result is required"];

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

