import EditDataElementWizard from '@/components/app/dataElements/edit/EditDataElementWizard'
import React from 'react'

interface DataElementEditPageProps {
  params: Promise<{ id: string }>;
}

const DataElementEditPage = async ({ params }: DataElementEditPageProps) => {
  const { id } = await params;
  const elementId = Number(id);
  return <EditDataElementWizard elementId={elementId} />;
}

export default DataElementEditPage

