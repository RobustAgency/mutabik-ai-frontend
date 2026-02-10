import EditDatasetWizard from "@/components/app/datasets/edit/EditDatasetWizard";

interface DatasetEditPageProps {
  params: Promise<{ id: string }>;
}

const DatasetEditPage = async ({ params }: DatasetEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditDatasetWizard datasetId={Number(id)} />
    </div>
  )
};

export default DatasetEditPage;

