import EditIncidentNotificationWizard from '@/components/app/incidents/notifications/edit/EditIncidentNotificationWizard'
import React, { use } from 'react'

interface EditIncidentNotificationPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentNotificationPage = ({ params }: EditIncidentNotificationPageProps) => {
  const { id } = use(params);
  return <EditIncidentNotificationWizard notificationId={Number(id)} />;
};

export default EditIncidentNotificationPage;


