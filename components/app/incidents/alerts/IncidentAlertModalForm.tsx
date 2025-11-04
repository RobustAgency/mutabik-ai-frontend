"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IncidentAlertForm from "./create/IncidentAlertForm";
import {
  CreateIncidentAlertData,
  useCreateIncidentAlertMutation,
} from "@/app/lib/features/incidentAlertsApi";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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

