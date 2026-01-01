"use client";

import EditAgreementWizard from "@/components/app/agreements/edit/EditAgreementWizard";
import React from "react";

interface AgreementEditPageProps {
  params: Promise<{ id: string }>;
}

const AgreementEditPage = async ({ params }: AgreementEditPageProps) => {
  const { id } = await params;
  const agreementId = parseInt(id, 10);

  if (isNaN(agreementId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid agreement ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditAgreementWizard agreementId={agreementId} />
    </div>
  );
};

export default AgreementEditPage;


