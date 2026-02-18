import CreateRiskMethodology from "@/components/app/riskMethodologies/create/CreateRiskMethodology";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function CreateRiskMethodologyPage() {
  return (
    <PermissionPage permission={PERMISSIONS.RISK_METHODOLOGIES_CREATE}>
      <CreateRiskMethodology />
    </PermissionPage>
  );
}

