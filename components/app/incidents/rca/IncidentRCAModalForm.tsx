"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IncidentRCAForm from "./create/IncidentRCAForm";
import { 
  CreateIncidentRootCauseAnalysisData, 
  useCreateIncidentRootCauseAnalysisMutation,
  RcaMethod
} from "@/app/lib/features/incidentRootCauseAnalysesApi";

interface IncidentRCAModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: number;
}

const IncidentRCAModalForm: React.FC<IncidentRCAModalFormProps> = ({ isOpen, onClose, incidentId }) => {
  const [createRCA, { isLoading }] = useCreateIncidentRootCauseAnalysisMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentRootCauseAnalysisData>({
    ai_incident_id: incidentId || 0,
    rca_method: RcaMethod.FIVE_WHYS,
    analysis_date: null,
    immediate_cause: "",
    root_causes: "",
    contributing_factors: null,
    control_failures: null,
    recommendations: "",
    lead_analyst: "",
    review_committee: null,
    approved_at: null,
    report_link: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await createRCA(formData).unwrap();
      onClose();
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Root Cause Analysis</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <IncidentRCAForm formData={formData} setFormData={setFormData} errors={errors} />
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
              {isLoading ? "Creating..." : "Submit RCA"}
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

export default IncidentRCAModalForm;

