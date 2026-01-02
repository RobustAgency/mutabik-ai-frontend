import EditCAPAWizard from '@/components/app/incidents/capa/edit/EditCAPAWizard'
import React, { use } from 'react'

interface EditCAPAPageProps {
  params: Promise<{ id: string }>;
}

const EditCAPAPage = ({ params }: EditCAPAPageProps) => {
  const { id } = use(params);
  return <EditCAPAWizard capaId={Number(id)} />;
};

export default EditCAPAPage;

