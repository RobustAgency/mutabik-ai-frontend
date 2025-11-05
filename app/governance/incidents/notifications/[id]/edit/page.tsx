import EditIncidentNotification from '@/components/app/incidents/notifications/edit/EditIncidentNotification'
import React, { use } from 'react'

interface EditIncidentNotificationPageProps {
  params: Promise<{ id: string }>;
}

const EditIncidentNotificationPage = ({ params }: EditIncidentNotificationPageProps) => {
  const { id } = use(params);
  return <EditIncidentNotification notificationId={id} />;
};

export default EditIncidentNotificationPage;


