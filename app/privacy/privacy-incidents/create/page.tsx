"use client";

import React from "react";
import CreatePrivacyIncident from "@/components/app/privacyIncidents/create/CreatePrivacyIncident";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreatePrivacyIncidentPage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.PRIVACY_INCIDENTS_CREATE}>
      <CreatePrivacyIncident />
    </PermissionPage>
  );
};

export default CreatePrivacyIncidentPage;

