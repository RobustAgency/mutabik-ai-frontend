"use client";

import React from "react";
import EditComplianceEvidence from "@/components/app/complianceEvidences/edit/EditComplianceEvidence";
import { useParams } from "next/navigation";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const EditComplianceEvidencePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id || isNaN(Number(id))) {
    return (
      <PermissionPage permission={PERMISSIONS.COMPLIANCE_EVIDENCES_EDIT}>
        <div>Invalid compliance evidence ID</div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.COMPLIANCE_EVIDENCES_EDIT}>
      <EditComplianceEvidence id={Number(id)} />
    </PermissionPage>
  );
};

export default EditComplianceEvidencePage;

