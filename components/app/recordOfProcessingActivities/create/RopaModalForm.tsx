"use client";

import React from "react";
import { useCreateRecordOfProcessingActivityMutation } from "@/app/lib/features/recordOfProcessingActivitiesApi";
import type { CreateROPAData, RecordOfProcessingActivity } from "@/interfaces/RecordOfProcessingActivity";
import { ROPAForm } from "../shared/ROPAForm";

interface RopaModalFormProps {
  onSuccess?: (activity: RecordOfProcessingActivity) => void;
  onCancel?: () => void;
}

const RopaModalForm: React.FC<RopaModalFormProps> = ({ onSuccess, onCancel }) => {
  const [createROPA, { isLoading }] =
    useCreateRecordOfProcessingActivityMutation();

  const handleSubmit = async (
    data: CreateROPAData | Partial<CreateROPAData>
  ) => {
    const created = await createROPA(data as CreateROPAData).unwrap();
    if (onSuccess) {
      onSuccess(created);
    }
  };

  return (
    <ROPAForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={onCancel}
      title="Create Processing Activity"
      description="Create a new record of processing activity"
      hideHeader
    />
  );
};

export default RopaModalForm;


