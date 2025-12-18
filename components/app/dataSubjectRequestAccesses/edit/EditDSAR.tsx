"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetDataSubjectRequestAccessQuery,
  useUpdateDataSubjectRequestAccessMutation,
} from "@/app/lib/features/dataSubjectRequestAccessesApi";
import type { CreateDSARData } from "@/interfaces/DataSubjectRequestAccess";
import { DSARForm } from "../shared/DSARForm";

interface EditDSARProps {
  id: number;
}

const EditDSAR: React.FC<EditDSARProps> = ({ id }) => {
  const router = useRouter();
  const { data: dsar, isLoading: loadingDSAR } =
    useGetDataSubjectRequestAccessQuery(id);
  const [updateDSAR, { isLoading: isUpdating }] =
    useUpdateDataSubjectRequestAccessMutation();

  const handleSubmit = async (data: CreateDSARData | Partial<CreateDSARData>) => {
    await updateDSAR({ id, data: data as Partial<CreateDSARData> }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/dsar");
  };

  if (loadingDSAR) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading DSAR request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DSARForm
      mode="edit"
      initialData={dsar}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Data Subject Request Access"
      description="Update DSAR request information"
    />
  );
};

export default EditDSAR;


