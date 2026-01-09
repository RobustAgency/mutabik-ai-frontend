"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetCommitteeMeetingQuery,
  useUpdateCommitteeMeetingMutation,
} from "@/app/lib/features/committeeMeetingsApi";
import type { CreateCommitteeMeetingData } from "@/interfaces/CommitteeMeeting";
import { CommitteeMeetingForm } from "../shared/CommitteeMeetingForm";

interface EditCommitteeMeetingProps {
  meetingId: number;
}

const EditCommitteeMeeting: React.FC<EditCommitteeMeetingProps> = ({
  meetingId,
}) => {
  const router = useRouter();
  const { data: meeting, isLoading: loadingMeeting } =
    useGetCommitteeMeetingQuery(meetingId);
  const [updateMeeting, { isLoading: isUpdating }] =
    useUpdateCommitteeMeetingMutation();

  const handleSubmit = async (
    data: CreateCommitteeMeetingData | Partial<CreateCommitteeMeetingData>
  ) => {
    await updateMeeting({
      id: meetingId,
      data: data as Partial<CreateCommitteeMeetingData>,
    }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-meetings");
  };

  if (loadingMeeting) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee meeting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CommitteeMeetingForm
      mode="edit"
      initialData={meeting}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Committee Meeting"
      description="Update committee meeting information"
    />
  );
};

export default EditCommitteeMeeting;

