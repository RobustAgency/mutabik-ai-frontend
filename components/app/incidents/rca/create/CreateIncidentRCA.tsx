"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import IncidentRCAForm from "./IncidentRCAForm";
import { CreateIncidentRootCauseAnalysisData, useCreateIncidentRootCauseAnalysisMutation } from "@/app/lib/features/incidentRootCauseAnalysesApi";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

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
    const fieldErrors: Record<string, string[]> = {
      ai_incident_id: validateTextField(formData.ai_incident_id ? String(formData.ai_incident_id) : "", {
        required: true,
        messages: { required: "Incident is required" },
      }),
      rca_method: validateTextField(formData.rca_method, {
        required: true,
        messages: { required: "RCA method is required" },
      }),
      immediate_cause: validateTextField(formData.immediate_cause, {
        required: true,
        messages: { required: "Immediate cause is required" },
      }),
      latent_causes: validateTextField(formData.latent_causes, {
        required: true,
        messages: { required: "Latent causes is required" },
      }),
      lessons_learned: validateTextField(formData.lessons_learned, {
        required: true,
        messages: { required: "Lessons learned is required" },
      }),
      recommendations: validateTextField(formData.recommendations, {
        required: true,
        messages: { required: "Recommendations is required" },
      }),
      approved_by: validateTextField(formData.approved_by, {
        required: true,
        messages: { required: "Approved by is required" },
      }),
      approved_at: validateTextField(formData.approved_at, {
        required: true,
        messages: { required: "Approved at is required" },
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

