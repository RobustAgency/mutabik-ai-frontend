"use client";

import React from "react";
import EditComplianceEvidence from "@/components/app/complianceEvidences/edit/EditComplianceEvidence";
import { useParams } from "next/navigation";

const EditComplianceEvidencePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id || isNaN(Number(id))) {
    return <div>Invalid compliance evidence ID</div>;
  }

  return <EditComplianceEvidence id={Number(id)} />;
};

export default EditComplianceEvidencePage;

