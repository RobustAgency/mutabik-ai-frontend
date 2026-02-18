import EditROPA from "@/components/app/recordOfProcessingActivities/edit/EditROPA";
import React from "react";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface ROPAEditPageProps {
  params: Promise<{ id: string }>;
}

const ROPAEditPage = async ({ params }: ROPAEditPageProps) => {
  const { id } = await params;
  const activityId = parseInt(id, 10);

  if (isNaN(activityId)) {
    return (
      <PermissionPage permission={PERMISSIONS.ROPA_EDIT}>
        <div className="max-w-7xl mx-auto">
          <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
            <p className="text-[#667085]">Invalid activity ID</p>
          </div>
        </div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.ROPA_EDIT}>
      <div>
        <EditROPA activityId={activityId} />
      </div>
    </PermissionPage>
  );
};

export default ROPAEditPage;

