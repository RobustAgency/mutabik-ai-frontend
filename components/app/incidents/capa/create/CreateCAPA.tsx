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
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Create Corrective/Preventive Action
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                Create a new corrective/preventive action
              </p>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
                {isLoading ? "Creating..." : "Create CAPA"}
              </Button>
            </div>
          </div>
          <CardContent>
            <CAPAForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateCAPA;

