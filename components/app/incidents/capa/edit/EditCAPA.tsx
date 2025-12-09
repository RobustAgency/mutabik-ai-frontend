"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import CAPAForm from "../create/CAPAForm";
import {
  CreateCorrectivePreventiveActionData,
  useGetCorrectivePreventiveActionQuery,
  useUpdateCorrectivePreventiveActionMutation,
} from "@/app/lib/features/correctivePreventiveActionsApi";

interface EditCAPAProps {
  capaId: string;
}

const EditCAPA: React.FC<EditCAPAProps> = ({ capaId }) => {
  const router = useRouter();
  const idNum = Number(capaId);
  const { data: capa, isLoading: isLoadingCAPA } = useGetCorrectivePreventiveActionQuery(idNum, { skip: Number.isNaN(idNum) });
  const [updateCAPA, { isLoading }] = useUpdateCorrectivePreventiveActionMutation();
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

  useEffect(() => {
    if (capa) {
      setFormData({
        source_type: capa.source_type,
        source_id: capa.source_id,
        model_id: capa.model_id || null,
        title: capa.title,
        capa_type: capa.capa_type,
        priority: capa.priority,
        owner_team: capa.owner_team,
        assignee: capa.assignee || null,
        root_cause: capa.root_cause || null,
        actions: capa.actions || null,
        due_date: capa.due_date ? capa.due_date.slice(0, 10) : "",
        status: capa.status,
        verification_result: capa.verification_result,
        evidence_link: capa.evidence_link || null,
      });
    }
  }, [capa]);

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
      await updateCAPA({ id: idNum, data: formData }).unwrap();
      router.push(`/governance/incidents/capa/${capaId}/details`);
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid CAPA ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingCAPA) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading CAPA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!capa) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">CAPA not found</p>
            <Button onClick={() => router.push("/governance/incidents/capa")}>Back to CAPA</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Edit CAPA
              </h1>
              <p className="font-sans text-sm text-[#667085]">{capa.title}</p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Updating..." : "Update CAPA"}
            </Button>
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

export default EditCAPA;

