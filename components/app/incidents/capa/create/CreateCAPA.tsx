"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string[]> = {};

    if (!formData.source_type?.trim()) validationErrors.source_type = ["Source type is required"];
    if (!formData.source_id?.trim()) validationErrors.source_id = ["Source ID is required"];
    if (!formData.title?.trim()) validationErrors.title = ["Title is required"];
    if (!formData.capa_type?.trim()) validationErrors.capa_type = ["CAPA type is required"];
    if (!formData.priority?.trim()) validationErrors.priority = ["Priority is required"];
    if (!formData.owner_team?.trim()) validationErrors.owner_team = ["Owner team is required"];
    if (!formData.due_date?.trim()) validationErrors.due_date = ["Due date is required"];
    if (!formData.status?.trim()) validationErrors.status = ["Status is required"];
    if (!formData.verification_result?.trim()) validationErrors.verification_result = ["Verification result is required"];

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
      await createCAPA(formData).unwrap();
      router.push("/governance/incidents/capa");
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
            <CAPAForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateCAPA;

