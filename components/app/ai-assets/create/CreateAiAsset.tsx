"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAiAssetMutation, CreateAiAssetData } from "@/app/lib/features/aiAssetsApi";
import AiAssetForm from "@/components/app/ai-assets/create/AiAssetForm";
import { useRouter } from "next/navigation";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";
const CreateAiAsset: React.FC = () => {
  const router = useRouter();
  const [createAsset, { isLoading }] = useCreateAiAssetMutation();
  const [formData, setFormData] = React.useState<CreateAiAssetData>({});
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {};

    const atLeastOneFilled =
      formData.vendor_id ||
      formData.vendor_effective_from ||
      formData.vendor_effective_to ||
      formData.vendor_agreement_id ||
      formData.vendor_assessment_id;
    if (!atLeastOneFilled) {
      fieldErrors.form = ["Please fill in at least one field before submitting"];
    }

    if (formData.vendor_effective_from !== undefined) {
      const errs = validateTextField(formData.vendor_effective_from, {
        required: false,
        messages: { required: "Vendor effective from date is required if provided" },
      });
      if (errs.length) fieldErrors.vendor_effective_from = errs;
    }

    if (formData.vendor_effective_to !== undefined) {
      const errs = validateTextField(formData.vendor_effective_to, {
        required: false,
        messages: { required: "Vendor effective to date is required if provided" },
      });
      if (errs.length) fieldErrors.vendor_effective_to = errs;
    }

    if (formData.vendor_effective_from && formData.vendor_effective_to) {
      const fromDate = new Date(formData.vendor_effective_from);
      const toDate = new Date(formData.vendor_effective_to);
      if (toDate <= fromDate) {
        fieldErrors.vendor_effective_to = [
          ...(fieldErrors.vendor_effective_to ?? []),
          "Vendor effective to date must be after effective from date",
        ];
      }
    }

    const errors = createValidationErrors(fieldErrors);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createAsset(formData).unwrap();
      router.push("/core-assets/ai-assets");
    } catch (e: any) {
      const apiErrors = e?.error?.data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) setErrors(apiErrors);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-medium text-sm text-black">Create AI Asset</h2>
            <p className="font-sans text-sm text-[#667085]">Capture vendor details for this AI asset</p>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>

        <div className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
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
          <AiAssetForm formData={formData} setFormData={setFormData} errors={errors} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateAiAsset;


