"use client";

import { use } from "react";
import IncidentNotificationDetails from "@/components/app/incidents/notifications/details/IncidentNotificationDetails";

interface IncidentNotificationDetailsPageProps {
  params: Promise<{ id: string }>;
}

const IncidentNotificationDetailsPage = ({
  params,
}: IncidentNotificationDetailsPageProps) => {
  const { id } = use(params);
  return <IncidentNotificationDetails notificationId={id} />;
};

export default IncidentNotificationDetailsPage;
