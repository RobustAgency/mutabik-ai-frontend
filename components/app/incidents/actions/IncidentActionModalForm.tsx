"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IncidentActionForm from "./create/IncidentActionForm";
import { CreateIncidentActionData, useCreateIncidentActionMutation } from "@/app/lib/features/incidentActionsApi";

interface IncidentActionModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: number;
}

const IncidentActionModalForm: React.FC<IncidentActionModalFormProps> = ({ isOpen, onClose, incidentId }) => {
  const [createAction, { isLoading }] = useCreateIncidentActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentActionData>({
    ai_incident_id: incidentId || 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await createAction(formData).unwrap();
      onClose();
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Incident Action</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <IncidentActionForm formData={formData} setFormData={setFormData} errors={errors} />
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
              {isLoading ? "Creating..." : "Create Action"}
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

export default IncidentActionModalForm;

