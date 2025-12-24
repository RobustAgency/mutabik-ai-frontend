"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetAiCommitteeQuery,
  useUpdateAiCommitteeMutation,
} from "@/app/lib/features/aiCommitteesApi";
import type { CreateAiCommitteeData } from "@/interfaces/AiCommittee";
import { AiCommitteeForm } from "../shared/AiCommitteeForm";

interface EditAiCommitteeProps {
  committeeId: number;
}

const EditAiCommittee: React.FC<EditAiCommitteeProps> = ({ committeeId }) => {
  const router = useRouter();
  const { data: committee, isLoading: loadingCommittee } =
    useGetAiCommitteeQuery(committeeId);
  const [updateCommittee, { isLoading: isUpdating }] =
    useUpdateAiCommitteeMutation();

  const handleSubmit = async (data: CreateAiCommitteeData | Partial<CreateAiCommitteeData>) => {
    await updateCommittee({ id: committeeId, data: data as Partial<CreateAiCommitteeData> }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/ai-committees");
  };

  if (loadingCommittee) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading AI committee...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AiCommitteeForm
      mode="edit"
      initialData={committee}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit AI Committee"
      description="Update AI committee information"
    />
  );
};

export default EditAiCommittee;

