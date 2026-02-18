import EditStakeholderWizard from "@/components/app/stakeholders/edit/EditStakeholderWizard";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface StakeholderEditPageProps {
  params: Promise<{ id: string }>;
}

const StakeholderEditPage = async ({ params }: StakeholderEditPageProps) => {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.STAKEHOLDERS_EDIT}>
      <div>
        <EditStakeholderWizard stakeholderId={id} />
      </div>
    </PermissionPage>
  )
};

export default StakeholderEditPage;

