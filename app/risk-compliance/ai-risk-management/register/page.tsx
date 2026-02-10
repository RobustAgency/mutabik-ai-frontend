import AiRiskRegisterList from "@/components/app/aiRiskRegister/AiRiskRegister";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function AiRiskManagementRegisterPage() {
  return (
    <PermissionPage permission={PERMISSIONS.AI_RISK_REGISTER_VIEW}>
      <AiRiskRegisterList />
    </PermissionPage>
  );
}

