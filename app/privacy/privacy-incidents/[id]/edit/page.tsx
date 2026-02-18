"use client";

import React from "react";
import EditPrivacyIncident from "@/components/app/privacyIncidents/edit/EditPrivacyIncident";
import { useParams } from "next/navigation";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const EditPrivacyIncidentPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id || isNaN(Number(id))) {
    return (
      <PermissionPage permission={PERMISSIONS.PRIVACY_INCIDENTS_EDIT}>
        <div>Invalid privacy incident ID</div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.PRIVACY_INCIDENTS_EDIT}>
      <EditPrivacyIncident id={Number(id)} />
    </PermissionPage>
  );
};

export default EditPrivacyIncidentPage;

