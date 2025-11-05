"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import IncidentActionForm from "./IncidentActionForm";
import { CreateIncidentActionData, useCreateIncidentActionMutation } from "@/app/lib/features/incidentActionsApi";

const CreateIncidentAction: React.FC = () => {
  const router = useRouter();
  const [createAction, { isLoading }] = useCreateIncidentActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentActionData>({
    ai_incident_id: 0,
    action_type: "kill_switch",
    description: "",
    performed_by: "",
    started_at: "",
    completed_at: null,
    validation_result: "pending",
    validation_notes: null,
    linked_release_id: null,
    evidence_link: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await createAction(formData).unwrap();
      router.push("/governance/incidents/actions");
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
                Create Incident Action
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new incident action
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Creating..." : "Create Action"}
            </Button>
          </div>
          <CardContent>
            <IncidentActionForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentAction;

