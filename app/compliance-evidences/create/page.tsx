"use client";

import React from "react";
import CreateComplianceEvidence from "@/components/app/complianceEvidences/create/CreateComplianceEvidence";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateComplianceEvidencePage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMPLIANCE_EVIDENCES_CREATE}>
      <CreateComplianceEvidence />
    </PermissionPage>
  );
};

export default CreateComplianceEvidencePage;

