import EditStakeholder from "@/components/app/stakeholders/edit/EditStakeholder";

interface StakeholderEditPageProps {
  params: Promise<{ id: string }>;
}

const StakeholderEditPage = async ({ params }: StakeholderEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditStakeholder stakeholderId={id} />
    </div>
  )
};

export default StakeholderEditPage;

