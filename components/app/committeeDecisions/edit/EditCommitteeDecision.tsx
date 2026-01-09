"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetCommitteeDecisionQuery,
  useUpdateCommitteeDecisionMutation,
} from "@/app/lib/features/committeeDecisionsApi";
import type { CreateCommitteeDecisionData } from "@/interfaces/CommitteeDecision";
import { CommitteeDecisionForm } from "../shared/CommitteeDecisionForm";

interface EditCommitteeDecisionProps {
  decisionId: number;
}

const EditCommitteeDecision: React.FC<EditCommitteeDecisionProps> = ({
  decisionId,
}) => {
  const router = useRouter();
  const { data: decision, isLoading: loadingDecision } =
    useGetCommitteeDecisionQuery(decisionId);
  const [updateDecision, { isLoading: isUpdating }] =
    useUpdateCommitteeDecisionMutation();

  const handleSubmit = async (
    data: CreateCommitteeDecisionData | Partial<CreateCommitteeDecisionData>
  ) => {
    await updateDecision({
      id: decisionId,
      data: data as Partial<CreateCommitteeDecisionData>,
    }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-decisions");
  };

  if (loadingDecision) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee decision...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CommitteeDecisionForm
      mode="edit"
      initialData={decision}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Committee Decision"
      description="Update committee decision information"
    />
  );
};

export default EditCommitteeDecision;

