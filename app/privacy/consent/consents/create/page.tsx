import CreateUserConsent from "@/components/app/userConsents/create/CreateUserConsent";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateUserConsentPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.USER_CONSENTS_CREATE}>
      <CreateUserConsent />
    </PermissionPage>
  );
};

export default CreateUserConsentPage;

