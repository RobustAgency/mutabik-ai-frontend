"use client";



import { use } from "react";
import EditConsentCoverage from "@/components/app/consentCoverage/edit/EditConsentCoverage";

interface EditConsentCoveragePageProps {
  params: Promise<{ id: string }>;
}

const EditConsentCoveragePage = ({ params }: EditConsentCoveragePageProps) => {
  const { id } = use(params);
  return <EditConsentCoverage coverageId={id} />;
};

export default EditConsentCoveragePage;

