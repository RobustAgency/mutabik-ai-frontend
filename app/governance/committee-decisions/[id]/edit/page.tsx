import EditCommitteeDecision from "@/components/app/committeeDecisions/edit/EditCommitteeDecision";
import React from "react";

interface CommitteeDecisionEditPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeDecisionEditPage = async ({ params }: CommitteeDecisionEditPageProps) => {
  const { id } = await params;
  const decisionId = parseInt(id, 10);

  if (isNaN(decisionId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid decision ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditCommitteeDecision decisionId={decisionId} />
    </div>
  );
};

export default CommitteeDecisionEditPage;

