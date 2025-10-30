"use client";

import { use } from "react";
import PdpProcessingRegisterDetails from "@/components/app/pdpProcessingRegister/details/PdpProcessingRegisterDetails";

interface PdpProcessingRegisterDetailsPageProps {
  params: Promise<{ id: string }>;
}

const PdpProcessingRegisterDetailsPage = ({ params }: PdpProcessingRegisterDetailsPageProps) => {
  const { id } = use(params);
  return <PdpProcessingRegisterDetails registerId={id} />;
};

export default PdpProcessingRegisterDetailsPage;

