export const runtime = 'edge';

import EditDataset from "@/components/app/datasets/edit/EditDataset";

interface DatasetEditPageProps {
  params: Promise<{ id: string }>;
}

const DatasetEditPage = async ({ params }: DatasetEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditDataset datasetId={id} />
    </div>
  )
};

export default DatasetEditPage;

