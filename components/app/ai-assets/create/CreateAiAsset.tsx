"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAiAssetMutation, CreateAiAssetData } from "@/app/lib/features/aiAssetsApi";
import AiAssetForm from "@/components/app/ai-assets/create/AiAssetForm";
import { useRouter } from "next/navigation";
const CreateAiAsset: React.FC = () => {
  const router = useRouter();
  const [createAsset, { isLoading }] = useCreateAiAssetMutation();
  const [formData, setFormData] = React.useState<CreateAiAssetData>({});
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const isFormEmpty = () => {
    return !formData.vendor_id &&
      !formData.vendor_effective_from &&
      !formData.vendor_effective_to &&
      !formData.vendor_agreement_id &&
      !formData.vendor_assessment_id;
  };

  const handleSubmit = async () => {
    setErrors({});

    if (isFormEmpty()) {
      setErrors({ form: ["Please fill in at least one field before submitting"] });
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
          {errors.form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.form[0]}</AlertDescription>
            </Alert>
          )}
          <AiAssetForm formData={formData} setFormData={setFormData} errors={errors} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateAiAsset;


