import AiCommitteeDetails from "@/components/app/aiCommittees/details/AiCommitteeDetails";
import React from "react";

interface AiCommitteeDetailsPageProps {
  params: Promise<{ id: string }>;
}

const AiCommitteeDetailsPage = async ({ params }: AiCommitteeDetailsPageProps) => {
  const { id } = await params;
  const committeeId = parseInt(id, 10);

  if (isNaN(committeeId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid committee ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AiCommitteeDetails committeeId={committeeId} />
    </div>
  );
};

export default AiCommitteeDetailsPage;

