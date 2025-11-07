"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

  const validateForm = (): boolean => {
    if (!formData) return false;
    const validationErrors: Record<string, string[]> = {};

    if (!formData.ai_incident_id) validationErrors.ai_incident_id = ["Incident is required"];
    if (!formData.rca_method?.trim()) validationErrors.rca_method = ["RCA method is required"];
    if (!formData.immediate_cause?.trim()) validationErrors.immediate_cause = ["Immediate cause is required"];
    if (!formData.latent_causes?.trim()) validationErrors.latent_causes = ["Latent causes is required"];
    if (!formData.lessons_learned?.trim()) validationErrors.lessons_learned = ["Lessons learned is required"];
    if (!formData.recommendations?.trim()) validationErrors.recommendations = ["Recommendations is required"];
    if (!formData.approved_by?.trim()) validationErrors.approved_by = ["Approved by is required"];
    if (!formData.approved_at?.trim()) validationErrors.approved_at = ["Approved at is required"];

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await updateRCA({ id: idNum, data: formData }).unwrap();
    } catch (e: any) {
      const apiErrors = e?.error?.data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) {
        setErrors(apiErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-medium text-sm text-black">Edit Root Cause Analysis</h2>
            <p className="font-sans text-sm text-[#667085]">Update RCA details</p>
          </div>
        </div>

        {isLoading || !formData ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="space-y-6">
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
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
            {formData && (
              <IncidentRCAForm
                formData={formData}
                // Ensure setFormData always receives a function or object with non-null value
                setFormData={(dataOrUpdater) => {
                  // Accept both functional and object signature for setState
                  if (typeof dataOrUpdater === "function") {
                    setFormData((prev) =>
                      prev
                        ? (dataOrUpdater as (prev: CreateIncidentRootCauseAnalysisData) => CreateIncidentRootCauseAnalysisData)(prev)
                        : prev // If prev is null, do nothing
                    );
                  } else {
                    setFormData(dataOrUpdater);
                  }
                }}
                errors={errors}
              />
            )}
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


