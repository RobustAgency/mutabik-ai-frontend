"use client";

import React from "react";
import EditPrivacyIncident from "@/components/app/privacyIncidents/edit/EditPrivacyIncident";
import { useParams } from "next/navigation";

const EditPrivacyIncidentPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id || isNaN(Number(id))) {
    return <div>Invalid privacy incident ID</div>;
  }

  return <EditPrivacyIncident id={Number(id)} />;
};

export default EditPrivacyIncidentPage;

