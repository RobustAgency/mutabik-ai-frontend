"use client";

import React from "react";
import PrivacyIncidents from "@/components/app/privacyIncidents/PrivacyIncidents";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const PrivacyIncidentsPage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.PRIVACY_INCIDENTS_VIEW}>
      <PrivacyIncidents />
    </PermissionPage>
  );
};

export default PrivacyIncidentsPage;

