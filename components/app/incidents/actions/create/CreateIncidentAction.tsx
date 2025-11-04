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
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent>
          <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939] mb-6">
            Create Incident Action
          </h1>
          <form onSubmit={handleSubmit}>
            <IncidentActionForm formData={formData} setFormData={setFormData} errors={errors} />
            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
                {isLoading ? "Creating..." : "Create Action"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/governance/incidents/actions")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIncidentAction;

