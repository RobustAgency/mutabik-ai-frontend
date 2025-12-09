import EditCAPA from '@/components/app/incidents/capa/edit/EditCAPA'
import React, { use } from 'react'

interface EditCAPAPageProps {
  params: Promise<{ id: string }>;
}

const EditCAPAPage = ({ params }: EditCAPAPageProps) => {
  const { id } = use(params);
  return <EditCAPA capaId={id} />;
};

export default EditCAPAPage;

