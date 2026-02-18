import CreateConsentCoverage from "@/components/app/consentCoverage/create/CreateConsentCoverage";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateConsentCoveragePage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.CONSENT_COVERAGES_CREATE}>
      <CreateConsentCoverage />
    </PermissionPage>
  );
};

export default CreateConsentCoveragePage;

