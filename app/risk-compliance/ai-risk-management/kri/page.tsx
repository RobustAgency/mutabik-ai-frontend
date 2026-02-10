import KriIndicatorsList from "@/components/app/kriIndicators/KriIndicators";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function AiRiskManagementKriPage() {
  return (
    <PermissionPage permission={PERMISSIONS.KRI_INDICATORS_VIEW}>
      <KriIndicatorsList />
    </PermissionPage>
  );
}

