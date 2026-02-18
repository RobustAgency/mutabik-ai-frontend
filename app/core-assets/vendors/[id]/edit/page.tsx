import EditVendorWizard from "@/components/app/vendors/edit/EditVendorWizard";
import React from "react";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface VendorEditPageProps {
  params: Promise<{ id: string }>;
}

const VendorEditPage = async ({ params }: VendorEditPageProps) => {
  const { id } = await params;
  const vendorId = parseInt(id, 10);

  if (isNaN(vendorId)) {
    return (
      <PermissionPage permission={PERMISSIONS.VENDORS_EDIT}>
        <div className="max-w-7xl mx-auto">
          <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
            <p className="text-[#667085]">Invalid vendor ID</p>
          </div>
        </div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.VENDORS_EDIT}>
      <div>
        <EditVendorWizard vendorId={vendorId} />
      </div>
    </PermissionPage>
  );
};

export default VendorEditPage;

