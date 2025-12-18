"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateDataSubjectRequestAccessMutation } from "@/app/lib/features/dataSubjectRequestAccessesApi";
import type { CreateDSARData } from "@/interfaces/DataSubjectRequestAccess";
import { DSARForm } from "../shared/DSARForm";

const CreateDSAR: React.FC = () => {
  const router = useRouter();
  const [createDSAR, { isLoading }] =
    useCreateDataSubjectRequestAccessMutation();

  const handleSubmit = async (data: CreateDSARData | Partial<CreateDSARData>) => {
    await createDSAR(data as CreateDSARData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/dsar");
  };

  return (
    <DSARForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Data Subject Request Access"
      description="Complete all steps to create a new DSAR request"
    />
  );
};

export default CreateDSAR;


