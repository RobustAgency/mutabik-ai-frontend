import EditIncidentRCA from '@/components/app/incidents/rca/edit/EditIncidentRCA'
import React, { use } from 'react'

interface EditIncidentRCAPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentRCAPage = ({ params }: EditIncidentRCAPageProps) => {
  const { id } = use(params);
  return <EditIncidentRCA rcaId={id} />;
};

export default EditIncidentRCAPage;


