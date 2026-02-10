import EditDataSourceWizard from "@/components/app/dataSources/edit/EditDataSourceWizard";

interface DataSourceEditPageProps {
  params: Promise<{ id: string }>;
}

const DataSourceEditPage = async ({ params }: DataSourceEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditDataSourceWizard dataSourceId={Number(id)} />
    </div>
  )
};

export default DataSourceEditPage;

