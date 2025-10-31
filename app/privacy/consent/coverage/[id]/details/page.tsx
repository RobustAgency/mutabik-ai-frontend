"use client";

export const runtime = 'edge';

import { use } from "react";
import ConsentCoverageDetails from "@/components/app/consentCoverage/details/ConsentCoverageDetails";

interface ConsentCoverageDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ConsentCoverageDetailsPage = ({ params }: ConsentCoverageDetailsPageProps) => {
  const { id } = use(params);
  return <ConsentCoverageDetails coverageId={id} />;
};

export default ConsentCoverageDetailsPage;

