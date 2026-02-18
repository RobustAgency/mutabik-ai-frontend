"use client";

import { use } from "react";
import EditConsentScope from "@/components/app/consentScopes/edit/EditConsentScope";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface EditConsentScopePageProps {
  params: Promise<{ id: string }>;
}

const EditConsentScopePage = ({ params }: EditConsentScopePageProps) => {
  const { id } = use(params);
  return (
    <PermissionPage permission={PERMISSIONS.CONSENT_SCOPES_EDIT}>
      <EditConsentScope scopeId={id} />
    </PermissionPage>
  );
};

export default EditConsentScopePage;

