"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CAPAForm from "./CAPAForm";
import { CreateCorrectivePreventiveActionData, useCreateCorrectivePreventiveActionMutation } from "@/app/lib/features/correctivePreventiveActionsApi";

const CreateCAPA: React.FC = () => {
  const router = useRouter();
  const [createCAPA, { isLoading }] = useCreateCorrectivePreventiveActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateCorrectivePreventiveActionData>({
    source_type: "incident",
    source_id: "",
    model_id: null,
    title: "",
    capa_type: "corrective",
    priority: "medium",
    owner_team: "product_ops",
    assignee: null,
    root_cause: null,
    actions: null,
    due_date: "",
    status: "new",
    verification_result: "pending",
    evidence_link: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await createCAPA(formData).unwrap();
      router.push("/governance/incidents/capa");
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent>
          <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939] mb-6">
            Create Corrective/Preventive Action
          </h1>
          <form onSubmit={handleSubmit}>
            <CAPAForm formData={formData} setFormData={setFormData} errors={errors} />
            <div className="flex gap-3 mt-6">
              <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
                {isLoading ? "Creating..." : "Create CAPA"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/governance/incidents/capa")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCAPA;

