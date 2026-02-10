import AiRiskTreatmentsList from "@/components/app/aiRiskTreatments/AiRiskTreatments";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function AiRiskManagementTreatmentPage() {
  return (
    <PermissionPage permission={PERMISSIONS.AI_RISK_TREATMENTS_VIEW}>
      <AiRiskTreatmentsList />
    </PermissionPage>
  );
}

