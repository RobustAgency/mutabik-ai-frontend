"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetConsentRecordQuery,
  useUpdateConsentRecordMutation,
} from "@/app/lib/features/consentRecordsApi";
import type { CreateConsentRecordData } from "@/interfaces/ConsentRecord";
import { ConsentRecordForm } from "../shared/ConsentRecordForm";

interface EditConsentRecordProps {
  id: number;
}

const EditConsentRecord: React.FC<EditConsentRecordProps> = ({ id }) => {
  const router = useRouter();
  const { data: record, isLoading: loadingRecord } =
    useGetConsentRecordQuery(id);
  const [updateConsentRecord, { isLoading: isUpdating }] =
    useUpdateConsentRecordMutation();

  const handleSubmit = async (
    data: CreateConsentRecordData | Partial<CreateConsentRecordData>
  ) => {
    await updateConsentRecord({
      id,
      data: data as Partial<CreateConsentRecordData>,
    }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/consent/records");
  };

  if (loadingRecord) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading consent record...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ConsentRecordForm
      mode="edit"
      initialData={record}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Consent Record"
      description="Update consent record information"
    />
  );
};

export default EditConsentRecord;


