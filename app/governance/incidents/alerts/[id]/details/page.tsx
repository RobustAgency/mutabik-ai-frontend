"use client";

import { use } from "react";
import IncidentAlertDetails from "@/components/app/incidents/alerts/details/IncidentAlertDetails";

interface IncidentAlertDetailsPageProps {
  params: Promise<{ id: string }>;
}

const IncidentAlertDetailsPage = ({
  params,
}: IncidentAlertDetailsPageProps) => {
  const { id } = use(params);
  return <IncidentAlertDetails alertId={id} />;
};

export default IncidentAlertDetailsPage;
