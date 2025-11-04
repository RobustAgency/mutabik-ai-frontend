"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import IncidentAlertForm from "./IncidentAlertForm";
import {
  CreateIncidentAlertData,
  useCreateIncidentAlertMutation,
} from "@/app/lib/features/incidentAlertsApi";

const CreateIncidentAlert: React.FC = () => {
  const router = useRouter();
  const [createAlert, { isLoading }] = useCreateIncidentAlertMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentAlertData>({
    ai_incident_id: 0,
    source_type: "monitoring_rule",
    source_ref: null,
    rule_version: null,
    context: null,
    first_seen_at: "",
    last_seen_at: null,
    evidence_link: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createAlert(formData).unwrap();
      router.push("/governance/incidents/alerts");
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Log Incident Alert
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new alert signal
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <IncidentAlertForm
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
                {isLoading ? "Creating..." : "Log Alert"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/governance/incidents/alerts")}
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

export default CreateIncidentAlert;

