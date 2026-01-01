import EditIncidentRCAWizard from '@/components/app/incidents/rca/edit/EditIncidentRCAWizard'
import React, { use } from 'react'

interface EditIncidentRCAPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentRCAPage = ({ params }: EditIncidentRCAPageProps) => {
  const { id } = use(params);
  return <EditIncidentRCAWizard rcaId={Number(id)} />;
};

export default EditIncidentRCAPage;


