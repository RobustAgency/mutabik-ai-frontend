"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetRecordOfProcessingActivityQuery,
  useUpdateRecordOfProcessingActivityMutation,
} from "@/app/lib/features/recordOfProcessingActivitiesApi";
import type { CreateROPAData } from "@/interfaces/RecordOfProcessingActivity";
import { ROPAForm } from "../shared/ROPAForm";

interface EditROPAProps {
  activityId: number;
}

const EditROPA: React.FC<EditROPAProps> = ({ activityId }) => {
  const router = useRouter();
  const { data: activity, isLoading: loadingActivity } =
    useGetRecordOfProcessingActivityQuery(activityId);
  const [updateROPA, { isLoading: isUpdating }] =
    useUpdateRecordOfProcessingActivityMutation();

  const handleSubmit = async (data: CreateROPAData | Partial<CreateROPAData>) => {
    await updateROPA({ id: activityId, data: data as Partial<CreateROPAData> }).unwrap();
  };

  const handleSuccess = () => {
    // After editing, redirect back to the list page
    router.push("/privacy/ropa");
  };

  if (loadingActivity) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading processing activity...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ROPAForm
      mode="edit"
      initialData={activity}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Record of Processing Activity"
      description="Update processing activity information"
    />
  );
};

export default EditROPA;
