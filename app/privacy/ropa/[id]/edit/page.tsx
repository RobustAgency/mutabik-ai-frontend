import EditROPA from "@/components/app/recordOfProcessingActivities/edit/EditROPA";
import React from "react";

interface ROPAEditPageProps {
  params: Promise<{ id: string }>;
}

const ROPAEditPage = async ({ params }: ROPAEditPageProps) => {
  const { id } = await params;
  const activityId = parseInt(id, 10);

  if (isNaN(activityId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid activity ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditROPA activityId={activityId} />
    </div>
  );
};

export default ROPAEditPage;

