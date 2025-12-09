import AiIncidentDetails from '@/components/app/incidents/details/AiIncidentDetails'
import React, { use } from 'react'

interface AiIncidentDetailsPageProps {
  params: Promise<{ id: string }>;
}

const AiIncidentDetailsPage = ({ params }: AiIncidentDetailsPageProps) => {
  const { id } = use(params);
  return <AiIncidentDetails incidentId={id} />;
};

export default AiIncidentDetailsPage;

