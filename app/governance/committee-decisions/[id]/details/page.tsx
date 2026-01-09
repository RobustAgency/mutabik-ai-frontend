import CommitteeDecisionDetails from "@/components/app/committeeDecisions/details/CommitteeDecisionDetails";
import React from "react";

interface CommitteeDecisionDetailsPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeDecisionDetailsPage = async ({ params }: CommitteeDecisionDetailsPageProps) => {
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
      <CommitteeDecisionDetails decisionId={decisionId} />
    </div>
  );
};

export default CommitteeDecisionDetailsPage;

