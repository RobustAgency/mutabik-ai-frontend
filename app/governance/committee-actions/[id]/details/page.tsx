import CommitteeActionDetails from "@/components/app/committeeActions/details/CommitteeActionDetails";
import React from "react";

interface CommitteeActionDetailsPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeActionDetailsPage = async ({ params }: CommitteeActionDetailsPageProps) => {
  const { id } = await params;
  const actionId = parseInt(id, 10);

  if (isNaN(actionId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid action ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CommitteeActionDetails actionId={actionId} />
    </div>
  );
};

export default CommitteeActionDetailsPage;

