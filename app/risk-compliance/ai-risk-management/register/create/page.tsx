import CreateAiRiskRegister from "@/components/app/aiRiskRegister/create/CreateAiRiskRegister";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function CreateAiRiskRegisterPage() {
  return (
    <PermissionPage permission={PERMISSIONS.AI_RISK_REGISTER_CREATE}>
      <CreateAiRiskRegister />
    </PermissionPage>
  );
}

