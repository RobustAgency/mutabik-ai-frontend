"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetAiAssetQuery, useUpdateAiAssetMutation, CreateAiAssetData } from "@/app/lib/features/aiAssetsApi";
import AiAssetForm from "@/components/app/ai-assets/create/AiAssetForm";
import { useRouter } from "next/navigation";
interface EditAiAssetProps {
  aiAssetId: string;
}

const EditAiAsset: React.FC<EditAiAssetProps> = ({ aiAssetId }) => {
  const idNum = Number(aiAssetId);
  const { data, isLoading } = useGetAiAssetQuery(idNum, { skip: !idNum });
  const [updateAsset, { isLoading: isSubmitting }] = useUpdateAiAssetMutation();
  const router = useRouter();
  const [formData, setFormData] = React.useState<CreateAiAssetData | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (data) {
      setFormData({
        vendor_id: data.vendor_id ?? null,
        vendor_effective_from: data.vendor_effective_from ?? null,
        vendor_effective_to: data.vendor_effective_to ?? null,
        vendor_agreement_id: data.vendor_agreement_id ?? null,
        vendor_assessment_id: data.vendor_assessment_id ?? null,
      });
    }
  }, [data]);

  const isFormEmpty = () => {
    if (!formData) return true;
    return !formData.vendor_id && 
           !formData.vendor_effective_from && 
           !formData.vendor_effective_to && 
           !formData.vendor_agreement_id && 
           !formData.vendor_assessment_id;
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setErrors({});
    
    if (isFormEmpty()) {
      setErrors({ form: ["Please fill in at least one field before submitting"] });
      return;
    }

    try {
      await updateAsset({ id: idNum, data: formData }).unwrap();
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
            <h2 className="font-sans font-medium text-sm text-black">Edit AI Asset</h2>
            <p className="font-sans text-sm text-[#667085]">Update vendor details for this AI asset</p>
          </div>
        </div>

        {isLoading || !formData ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="space-y-6">
            {errors.form && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.form[0]}</AlertDescription>
              </Alert>
            )}
            {formData && (
              <AiAssetForm
                formData={formData}
                setFormData={setFormData as React.Dispatch<React.SetStateAction<CreateAiAssetData>>}
                errors={errors}
              />
            )}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditAiAsset;


