"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AiIncidentForm from "./AiIncidentForm";
import {
  CreateAiIncidentData,
  useCreateAiIncidentMutation,
} from "@/app/lib/features/aiIncidentsApi";

const CreateAiIncident: React.FC = () => {
  const router = useRouter();
  const [createIncident, { isLoading }] = useCreateAiIncidentMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateAiIncidentData>({
    title: "",
    summary: "",
    category: "safety",
    severity: "sev3_medium",
    status: "open",
    stage: "prod",
    ic_owner: "",
    model_id: null,
    model_version_id: null,
    use_case_id: null,
    first_seen_at: "",
    declared_at: "",
    resolved_at: null,
    closed_at: null,
    impacted_users: null,
    impacted_data: [],
    impacted_systems: null,
    linked_release_id: null,
    linked_risk_id: null,
    linked_assessment_id: null,
    linked_capa_id: null,
    evidence_link: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createIncident(formData).unwrap();
      router.push("/governance/incidents");
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Declare AI Incident
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new incident or near-miss record
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AiIncidentForm
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
                {isLoading ? "Creating..." : "Declare Incident"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/governance/incidents")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAiIncident;

