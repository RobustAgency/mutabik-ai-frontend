"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetCommitteeActionQuery,
  useUpdateCommitteeActionMutation,
} from "@/app/lib/features/committeeActionsApi";
import type { CreateCommitteeActionData } from "@/interfaces/CommitteeAction";
import { CommitteeActionForm } from "../shared/CommitteeActionForm";

interface EditCommitteeActionProps {
  actionId: number;
}

const EditCommitteeAction: React.FC<EditCommitteeActionProps> = ({
  actionId,
}) => {
  const router = useRouter();
  const { data: action, isLoading: loadingAction } =
    useGetCommitteeActionQuery(actionId);
  const [updateAction, { isLoading: isUpdating }] =
    useUpdateCommitteeActionMutation();

  const handleSubmit = async (
    data: CreateCommitteeActionData | Partial<CreateCommitteeActionData>
  ) => {
    await updateAction({
      id: actionId,
      data: data as Partial<CreateCommitteeActionData>,
    }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-actions");
  };

  if (loadingAction) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee action...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CommitteeActionForm
      mode="edit"
      initialData={action}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Committee Action"
      description="Update committee action information"
    />
  );
};

export default EditCommitteeAction;

