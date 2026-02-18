import EditKriIndicator from "@/components/app/kriIndicators/edit/EditKriIndicator";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default async function EditKriIndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.KRI_INDICATORS_EDIT}>
      <EditKriIndicator indicatorId={id} />
    </PermissionPage>
  );
}

