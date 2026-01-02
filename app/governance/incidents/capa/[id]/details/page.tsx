"use client";

import { use } from "react";
import CAPADetails from "@/components/app/incidents/capa/details/CAPADetails";

interface CAPADetailsPageProps {
  params: Promise<{ id: string }>;
}

const CAPADetailsPage = ({ params }: CAPADetailsPageProps) => {
  const { id } = use(params);
  return <CAPADetails capaId={id} />;
};

export default CAPADetailsPage;
