"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateModelDatasetLinkMutation, CreateModelDatasetLinkData } from "@/app/lib/features/modelDatasetLinksApi";
import ModelDatasetLinkForm from "./ModelDatasetLinkForm";

const CreateModelDatasetLink: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateModelDatasetLinkData>({
    model_id: "",
    model_version_id: "",
    dataset_id: "",
    snapshot_id: "",
    role: "",
    access_path: "",
    transform_pack_link: "",
    license_check_ref: "",
    privacy_check_ref: "",
    eligibility_status: "",
    notes: "",
    created_by: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [createLink, { isLoading }] = useCreateModelDatasetLinkMutation();

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.model_id?.trim()) errors.model_id = ["Model ID is required"];
    if (!formData.model_version_id?.trim()) errors.model_version_id = ["Model version ID is required"];
    if (!formData.snapshot_id?.trim()) errors.snapshot_id = ["Snapshot ID is required (AC-05)"];
    if (!formData.role?.trim()) errors.role = ["Role is required"];
    if (!formData.created_by?.trim()) errors.created_by = ["Created by is required"];

    const trainRoles = ["train", "validation", "test", "eval_benchmark"];
    if (trainRoles.includes(formData.role) && !formData.snapshot_id?.trim()) {
      errors.snapshot_id = ["Snapshot ID is required for train/val/test/eval roles (AC-05)"];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createLink(formData).unwrap();
      router.push("/core-assets/data/model-links");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Create Model-Dataset Link</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Establish traceability between model and data snapshot</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Link"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <ModelDatasetLinkForm formData={formData} setFormData={setFormData} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateModelDatasetLink;

