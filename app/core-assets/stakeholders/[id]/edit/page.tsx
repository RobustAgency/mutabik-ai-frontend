

import EditStakeholderWizard from "@/components/app/stakeholders/edit/EditStakeholderWizard";

interface StakeholderEditPageProps {
  params: Promise<{ id: string }>;
}

const StakeholderEditPage = async ({ params }: StakeholderEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditStakeholderWizard stakeholderId={id} />
    </div>
  )
};

export default StakeholderEditPage;

