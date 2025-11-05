"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetIncidentRootCauseAnalysisQuery,
  useUpdateIncidentRootCauseAnalysisMutation,
  CreateIncidentRootCauseAnalysisData,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import IncidentRCAForm from "@/components/app/incidents/rca/create/IncidentRCAForm";

interface EditIncidentRCAProps {
  rcaId: string;
}

const EditIncidentRCA: React.FC<EditIncidentRCAProps> = ({ rcaId }) => {
  const idNum = Number(rcaId);
  const { data, isLoading } = useGetIncidentRootCauseAnalysisQuery(idNum, { skip: !idNum });
  const [updateRCA, { isLoading: isSubmitting }] = useUpdateIncidentRootCauseAnalysisMutation();

  const [formData, setFormData] = React.useState<CreateIncidentRootCauseAnalysisData | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (data) {
      setFormData({
        ai_incident_id: data.ai_incident_id,
        rca_method: data.rca_method,
        immediate_cause: data.immediate_cause,
        latent_causes: data.latent_causes,
        contributing_factors: data.contributing_factors ?? null,
        impact_assessment: data.impact_assessment ?? null,
        fixes_implemented: data.fixes_implemented ?? null,
        lessons_learned: data.lessons_learned,
        recommendations: data.recommendations,
        approved_by: data.approved_by,
        approved_at: data.approved_at,
        report_link: data.report_link ?? null,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!formData) return;
    setErrors({});
    try {
      await updateRCA({ id: idNum, data: formData }).unwrap();
    } catch (e: any) {
      const apiErrors = e?.error?.data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) setErrors(apiErrors);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-medium text-sm text-[#000]">Edit Root Cause Analysis</h2>
            <p className="font-sans text-sm text-[#667085]">Update RCA details</p>
          </div>
        </div>

        {isLoading || !formData ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="space-y-6">
            <IncidentRCAForm formData={formData} setFormData={setFormData} errors={errors} />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditIncidentRCA;


