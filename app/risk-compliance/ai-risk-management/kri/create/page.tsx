import CreateKriIndicator from "@/components/app/kriIndicators/create/CreateKriIndicator";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function CreateKriIndicatorPage() {
  return (
    <PermissionPage permission={PERMISSIONS.KRI_INDICATORS_CREATE}>
      <CreateKriIndicator />
    </PermissionPage>
  );
}

