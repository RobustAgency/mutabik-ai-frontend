import RiskMethodologies from "@/components/app/riskMethodologies/RiskMethodologies";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function AiRiskManagementMethodologiesPage() {
  return (
    <PermissionPage permission={PERMISSIONS.RISK_METHODOLOGIES_VIEW}>
      <RiskMethodologies />
    </PermissionPage>
  );
}

