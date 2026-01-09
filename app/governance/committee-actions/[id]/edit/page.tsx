import EditCommitteeAction from "@/components/app/committeeActions/edit/EditCommitteeAction";
import React from "react";

interface CommitteeActionEditPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeActionEditPage = async ({ params }: CommitteeActionEditPageProps) => {
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
      <EditCommitteeAction actionId={actionId} />
    </div>
  );
};

export default CommitteeActionEditPage;

