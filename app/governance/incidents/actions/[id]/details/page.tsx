"use client";

import { use } from "react";
import IncidentActionDetails from "@/components/app/incidents/actions/details/IncidentActionDetails";

interface IncidentActionDetailsPageProps {
  params: Promise<{ id: string }>;
}

const IncidentActionDetailsPage = ({
  params,
}: IncidentActionDetailsPageProps) => {
  const { id } = use(params);
  return <IncidentActionDetails actionId={id} />;
};

export default IncidentActionDetailsPage;

