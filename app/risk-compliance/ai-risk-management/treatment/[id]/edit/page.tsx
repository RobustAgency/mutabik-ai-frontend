import EditAiRiskTreatment from "@/components/app/aiRiskTreatments/edit/EditAiRiskTreatment";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default async function EditAiRiskTreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.AI_RISK_TREATMENTS_EDIT}>
      <EditAiRiskTreatment treatmentId={id} />
    </PermissionPage>
  );
}

