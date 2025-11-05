import EditIncidentAction from '@/components/app/incidents/actions/edit/EditIncidentAction'
import React, { use } from 'react'

interface EditIncidentActionPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentActionPage = ({ params }: EditIncidentActionPageProps) => {
  const { id } = use(params);
  return <EditIncidentAction actionId={id} />;
};

export default EditIncidentActionPage;


