

import EditDataElement from "@/components/app/dataElements/edit/EditDataElement";

interface DataElementEditPageProps {
  params: Promise<{ id: string }>;
}

const DataElementEditPage = async ({ params }: DataElementEditPageProps) => {
  const { id } = await params;
  return <EditDataElement elementId={id} />;
};

export default DataElementEditPage;

