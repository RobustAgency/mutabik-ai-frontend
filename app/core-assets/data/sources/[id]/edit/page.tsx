import EditDataSource from "@/components/app/dataSources/edit/EditDataSource";

interface DataSourceEditPageProps {
  params: Promise<{ id: string }>;
}

const DataSourceEditPage = async ({ params }: DataSourceEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditDataSource dataSourceId={id} />
    </div>
  )
};

export default DataSourceEditPage;

