import CreateConsentScope from "@/components/app/consentScopes/create/CreateConsentScope";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateConsentScopePage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.CONSENT_SCOPES_CREATE}>
      <CreateConsentScope />
    </PermissionPage>
  );
};

export default CreateConsentScopePage;

