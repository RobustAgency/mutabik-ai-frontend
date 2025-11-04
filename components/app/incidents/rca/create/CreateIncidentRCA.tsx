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
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent>
          <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939] mb-6">
            Create Root Cause Analysis
          </h1>
          <form onSubmit={handleSubmit}>
            <IncidentRCAForm formData={formData} setFormData={setFormData} errors={errors} />
            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
                {isLoading ? "Creating..." : "Submit RCA"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/governance/incidents/rca")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIncidentRCA;

