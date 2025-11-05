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
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Log Incident Alert
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new alert signal
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Creating..." : "Log Alert"}
            </Button>
          </div>
          <CardContent>
            <IncidentAlertForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentAlert;

