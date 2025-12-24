"use client";

import React from "react";
import ComplianceEvidenceDetails from "@/components/app/complianceEvidences/details/ComplianceEvidenceDetails";
import { useParams } from "next/navigation";

const ComplianceEvidenceDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Invalid compliance evidence ID</div>;
  }

  return <ComplianceEvidenceDetails id={id} />;
};

export default ComplianceEvidenceDetailsPage;

