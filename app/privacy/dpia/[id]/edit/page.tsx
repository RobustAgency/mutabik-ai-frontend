import React from "react";
import EditDPIA from "@/components/app/dpia/edit/EditDPIA";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return (
      <PermissionPage permission={PERMISSIONS.DPIA_EDIT}>
        <div className="max-w-7xl mx-auto">
          <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
            <p className="text-[#667085]">Invalid DPIA ID</p>
          </div>
        </div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.DPIA_EDIT}>
      <EditDPIA id={numericId} />
    </PermissionPage>
  );
};

export default page;


