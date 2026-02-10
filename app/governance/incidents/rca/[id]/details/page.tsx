"use client";

import { use } from "react";
import IncidentRCADetails from "@/components/app/incidents/rca/details/IncidentRCADetails";

interface IncidentRCADetailsPageProps {
  params: Promise<{ id: string }>;
}

const IncidentRCADetailsPage = ({ params }: IncidentRCADetailsPageProps) => {
  const { id } = use(params);
  return <IncidentRCADetails rcaId={id} />;
};

export default IncidentRCADetailsPage;
