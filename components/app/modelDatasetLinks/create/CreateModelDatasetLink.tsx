"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateModelDatasetLinkMutation, CreateModelDatasetLinkData } from "@/app/lib/features/modelDatasetLinksApi";
import ModelDatasetLinkForm from "./ModelDatasetLinkForm";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

const CreateModelDatasetLink: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateModelDatasetLinkData>({
    ai_model_id: "",
    ai_model_version_id: null,
    dataset_id: "",
    dataset_snapshot_id: "",
    role: "",
    access_path: "",
    transform_pack_link: "",
    license_check_ref: "",
    privacy_check_ref: "",
    eligibility_status: "",
    notes: "",
    created_by: "",
    source_created_at: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [createLink, { isLoading }] = useCreateModelDatasetLinkMutation();

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      ai_model_id: validateTextField(formData.ai_model_id, {
        required: true,
        messages: { required: "Model is required" },
      }),
      ai_model_version_id: validateTextField(
        formData.ai_model_version_id ? String(formData.ai_model_version_id) : "",
        {
          required: true,
          messages: { required: "Model version is required" },
        }
      ),
      dataset_id: validateTextField(formData.dataset_id, {
        required: true,
        messages: { required: "Dataset is required" },
      }),
      role: validateTextField(formData.role, {
        required: true,
        messages: { required: "Role is required" },
      }),
      created_by: validateTextField(formData.created_by, {
        required: true,
        messages: { required: "Created by is required" },
      }),
      source_created_at: validateTextField(formData.source_created_at, {
        required: true,
        messages: { required: "Created at is required" },
      }),
    };

    const trainRoles = ["train", "validation", "test", "eval_benchmark"];
    if (trainRoles.includes(formData.role) && !formData.dataset_snapshot_id?.trim()) {
      fieldErrors.dataset_snapshot_id = ["Snapshot is required for train/val/test/eval roles"];
    }

    const errors = createValidationErrors(fieldErrors);
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

