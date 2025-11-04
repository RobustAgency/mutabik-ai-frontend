import CAPADetails from '@/components/app/incidents/capa/details/CAPADetails'
import React, { use } from 'react'

interface CAPADetailsPageProps {
  params: Promise<{ id: string }>;
}

const CAPADetailsPage = ({ params }: CAPADetailsPageProps) => {
  const { id } = use(params);
  return <CAPADetails capaId={id} />;
};

export default CAPADetailsPage;

