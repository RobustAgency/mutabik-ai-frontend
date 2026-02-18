import EditRiskMethodology from "@/components/app/riskMethodologies/edit/EditRiskMethodology";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default async function EditRiskMethodologyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.RISK_METHODOLOGIES_EDIT}>
      <EditRiskMethodology methodologyId={id} />
    </PermissionPage>
  );
}

