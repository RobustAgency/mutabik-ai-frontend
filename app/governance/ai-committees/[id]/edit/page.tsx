import EditAiCommittee from "@/components/app/aiCommittees/edit/EditAiCommittee";
import React from "react";

interface AiCommitteeEditPageProps {
  params: Promise<{ id: string }>;
}

const AiCommitteeEditPage = async ({ params }: AiCommitteeEditPageProps) => {
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
      <EditAiCommittee committeeId={committeeId} />
    </div>
  );
};

export default AiCommitteeEditPage;

