"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import IncidentAlertForm from "./create/IncidentAlertForm";
import {
  CreateIncidentAlertData,
  useCreateIncidentAlertMutation,
} from "@/app/lib/features/incidentAlertsApi";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface IncidentAlertModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: number;
}

const IncidentAlertModalForm: React.FC<IncidentAlertModalFormProps> = ({
  isOpen,
  onClose,
  incidentId,
}) => {
  const [createAlert, { isLoading }] = useCreateIncidentAlertMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentAlertData>({
    ai_incident_id: incidentId || 0,
    source_type: "monitoring_rule",
    source_ref: null,
    rule_version: null,
    context: null,
    first_seen_at: "",
    last_seen_at: null,
    evidence_link: null,
  });

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      ai_incident_id: validateTextField(formData.ai_incident_id ? String(formData.ai_incident_id) : "", {
        required: true,
        messages: { required: "Incident is required" },
      }),
      source_type: validateTextField(formData.source_type, {
        required: true,
        messages: { required: "Source type is required" },
      }),
      first_seen_at: validateTextField(formData.first_seen_at, {
        required: true,
        messages: { required: "First seen at is required" },
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
      await createAlert(formData).unwrap();
      onClose();
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Incident Alert</DialogTitle>
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
          <IncidentAlertForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#4FD58F] text-white"
            >
              {isLoading ? "Creating..." : "Log Alert"}
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

export default IncidentAlertModalForm;

