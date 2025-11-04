import EditVendor from "@/components/app/vendors/edit/EditVendor";
import React from "react";

interface VendorEditPageProps {
  params: Promise<{ id: string }>;
}

const VendorEditPage = async ({ params }: VendorEditPageProps) => {
  const { id } = await params;
  const vendorId = parseInt(id, 10);

  if (isNaN(vendorId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid vendor ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditVendor vendorId={vendorId} />
    </div>
  );
};

export default VendorEditPage;

