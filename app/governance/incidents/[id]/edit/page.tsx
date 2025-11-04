import EditAiIncident from '@/components/app/incidents/edit/EditAiIncident'
import React, { use } from 'react'

interface EditAiIncidentPageProps {
  params: Promise<{ id: string }>;
}

const EditAiIncidentPage = ({ params }: EditAiIncidentPageProps) => {
  const { id } = use(params);
  return <EditAiIncident incidentId={id} />;
};

export default EditAiIncidentPage;

