"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await createRCA(formData).unwrap();
      router.push("/governance/incidents/rca");
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
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
            <IncidentRCAForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentRCA;

