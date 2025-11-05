"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
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

