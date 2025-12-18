"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetDataProtectionImpactAssessmentQuery,
  useUpdateDataProtectionImpactAssessmentMutation,
} from "@/app/lib/features/dataProtectionImpactAssessmentsApi";
import type { CreateDPIAData } from "@/interfaces/DataProtectionImpactAssessment";
import { DPIAForm } from "../shared/DPIAForm";

interface EditDPIAProps {
  id: number;
}

const EditDPIA: React.FC<EditDPIAProps> = ({ id }) => {
  const router = useRouter();
  const { data: dpia, isLoading: loadingDPIA } =
    useGetDataProtectionImpactAssessmentQuery(id);
  const [updateDPIA, { isLoading: isUpdating }] =
    useUpdateDataProtectionImpactAssessmentMutation();

  const handleSubmit = async (
    data: CreateDPIAData | Partial<CreateDPIAData>
  ) => {
    await updateDPIA({ id, data: data as Partial<CreateDPIAData> }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/dpia");
  };

  if (loadingDPIA) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading DPIA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DPIAForm
      mode="edit"
      initialData={dpia}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Data Protection Impact Assessment"
      description="Update DPIA information"
    />
  );
};

export default EditDPIA;


