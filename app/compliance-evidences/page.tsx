"use client";

import React from "react";
import ComplianceEvidences from "@/components/app/complianceEvidences/ComplianceEvidences";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const ComplianceEvidencesPage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMPLIANCE_EVIDENCES_VIEW}>
      <ComplianceEvidences />
    </PermissionPage>
  );
};

export default ComplianceEvidencesPage;

