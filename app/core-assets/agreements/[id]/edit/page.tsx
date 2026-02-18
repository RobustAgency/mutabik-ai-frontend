import EditAgreementWizard from "@/components/app/agreements/edit/EditAgreementWizard";
import React from "react";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface AgreementEditPageProps {
  params: Promise<{ id: string }>;
}

const AgreementEditPage = async ({ params }: AgreementEditPageProps) => {
  const { id } = await params;
  const agreementId = parseInt(id, 10);

  if (isNaN(agreementId)) {
    return (
      <PermissionPage permission={PERMISSIONS.AGREEMENTS_EDIT}>
        <div className="max-w-7xl mx-auto">
          <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
            <p className="text-[#667085]">Invalid agreement ID</p>
          </div>
        </div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.AGREEMENTS_EDIT}>
      <div>
        <EditAgreementWizard agreementId={agreementId} />
      </div>
    </PermissionPage>
  );
};

export default AgreementEditPage;


