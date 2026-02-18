import EditAiRiskRegister from "@/components/app/aiRiskRegister/edit/EditAiRiskRegister";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default async function EditAiRiskRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.AI_RISK_REGISTER_EDIT}>
      <EditAiRiskRegister riskId={id} />
    </PermissionPage>
  );
}

