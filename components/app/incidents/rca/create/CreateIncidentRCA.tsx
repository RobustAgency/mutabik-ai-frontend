"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import IncidentRCAForm from "./IncidentRCAForm";
import { CreateIncidentRootCauseAnalysisData, useCreateIncidentRootCauseAnalysisMutation } from "@/app/lib/features/incidentRootCauseAnalysesApi";

const CreateIncidentRCA: React.FC = () => {
  const router = useRouter();
  const [createRCA, { isLoading }] = useCreateIncidentRootCauseAnalysisMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentRootCauseAnalysisData>({
    ai_incident_id: 0,
    rca_method: "5_whys",
    immediate_cause: "",
    latent_causes: "",
    contributing_factors: null,
    impact_assessment: null,
    fixes_implemented: null,
    lessons_learned: "",
    recommendations: "",
    approved_by: "",
    approved_at: "",
    report_link: null,
  });

  const validateForm = (): boolean => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createRCA(formData).unwrap();
      router.push("/governance/incidents/rca");
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Create Root Cause Analysis
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new root cause analysis
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Creating..." : "Submit RCA"}
            </Button>
          </div>
          <CardContent>
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="mb-6">
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
            <IncidentRCAForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentRCA;

