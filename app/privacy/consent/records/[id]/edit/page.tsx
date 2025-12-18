import React from "react";
import EditConsentRecord from "@/components/app/consentRecords/edit/EditConsentRecord";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid consent record ID</p>
        </div>
      </div>
    );
  }

  return <EditConsentRecord id={numericId} />;
};

export default page;


