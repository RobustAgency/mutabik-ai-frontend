import EditIncidentActionWizard from '@/components/app/incidents/actions/edit/EditIncidentActionWizard'
import React, { use } from 'react'

interface EditIncidentActionPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentActionPage = ({ params }: EditIncidentActionPageProps) => {
  const { id } = use(params);
  return <EditIncidentActionWizard actionId={Number(id)} />;
};

export default EditIncidentActionPage;


