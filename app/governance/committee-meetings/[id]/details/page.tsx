import CommitteeMeetingDetails from "@/components/app/committeeMeetings/details/CommitteeMeetingDetails";
import React from "react";

interface CommitteeMeetingDetailsPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeMeetingDetailsPage = async ({ params }: CommitteeMeetingDetailsPageProps) => {
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
      <CommitteeMeetingDetails meetingId={meetingId} />
    </div>
  );
};

export default CommitteeMeetingDetailsPage;

