"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateConsentRecordMutation } from "@/app/lib/features/consentRecordsApi";
import type { CreateConsentRecordData } from "@/interfaces/ConsentRecord";
import { ConsentRecordForm } from "../shared/ConsentRecordForm";

const CreateConsentRecord: React.FC = () => {
  const router = useRouter();
  const [createConsentRecord, { isLoading }] =
    useCreateConsentRecordMutation();

  const handleSubmit = async (
    data: CreateConsentRecordData | Partial<CreateConsentRecordData>
  ) => {
    await createConsentRecord(data as CreateConsentRecordData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/consent/records");
  };

  return (
    <ConsentRecordForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Consent Record"
      description="Complete all steps to create a new consent record"
    />
  );
};

export default CreateConsentRecord;


