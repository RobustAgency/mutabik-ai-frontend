import EditIncidentAlertWizard from '@/components/app/incidents/alerts/edit/EditIncidentAlertWizard'
import React, { use } from 'react'

interface EditIncidentAlertPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentAlertPage = ({ params }: EditIncidentAlertPageProps) => {
  const { id } = use(params);
  return <EditIncidentAlertWizard alertId={Number(id)} />;
};

export default EditIncidentAlertPage;


