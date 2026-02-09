"use client";

import React from "react";
import RegulatorySubmissions from "@/components/app/regulatorySubmissions/RegulatorySubmissions";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const RegulatorySubmissionsPage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.REGULATORY_SUBMISSIONS_VIEW}>
      <RegulatorySubmissions />
    </PermissionPage>
  );
};

export default RegulatorySubmissionsPage;

