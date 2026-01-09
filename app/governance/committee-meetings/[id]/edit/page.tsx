import EditCommitteeMeeting from "@/components/app/committeeMeetings/edit/EditCommitteeMeeting";
import React from "react";

interface CommitteeMeetingEditPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeMeetingEditPage = async ({ params }: CommitteeMeetingEditPageProps) => {
  const { id } = await params;
  const meetingId = parseInt(id, 10);

  if (isNaN(meetingId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid meeting ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditCommitteeMeeting meetingId={meetingId} />
    </div>
  );
};

export default CommitteeMeetingEditPage;

