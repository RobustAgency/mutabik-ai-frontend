"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateRecordOfProcessingActivityMutation } from "@/app/lib/features/recordOfProcessingActivitiesApi";
import type { CreateROPAData } from "@/interfaces/RecordOfProcessingActivity";
import { ROPAForm } from "../shared/ROPAForm";

const CreateROPA: React.FC = () => {
  const router = useRouter();
  const [createROPA, { isLoading }] = useCreateRecordOfProcessingActivityMutation();

  const handleSubmit = async (data: CreateROPAData | Partial<CreateROPAData>) => {
    await createROPA(data as CreateROPAData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/ropa");
  };

  return (
    <ROPAForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Record of Processing Activity"
      description="Complete all steps to create your processing activity record"
    />
  );
};

export default CreateROPA;
