"use client";

import { use } from "react";
import EditUserConsent from "@/components/app/userConsents/edit/EditUserConsent";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface EditUserConsentPageProps {
  params: Promise<{ id: string }>;
}

const EditUserConsentPage = ({ params }: EditUserConsentPageProps) => {
  const { id } = use(params);
  return (
    <PermissionPage permission={PERMISSIONS.USER_CONSENTS_EDIT}>
      <EditUserConsent consentId={id} />
    </PermissionPage>
  );
};

export default EditUserConsentPage;

