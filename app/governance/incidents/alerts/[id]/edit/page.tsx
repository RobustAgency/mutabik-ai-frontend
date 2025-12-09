import EditIncidentAlert from '@/components/app/incidents/alerts/edit/EditIncidentAlert'
import React, { use } from 'react'

interface EditIncidentAlertPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentAlertPage = ({ params }: EditIncidentAlertPageProps) => {
  const { id } = use(params);
  return <EditIncidentAlert alertId={id} />;
};

export default EditIncidentAlertPage;


