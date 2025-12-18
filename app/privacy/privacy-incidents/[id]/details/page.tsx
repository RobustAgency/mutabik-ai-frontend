"use client";

import React from "react";
import PrivacyIncidentDetails from "@/components/app/privacyIncidents/details/PrivacyIncidentDetails";
import { useParams } from "next/navigation";

const PrivacyIncidentDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Invalid privacy incident ID</div>;
  }

  return <PrivacyIncidentDetails id={id} />;
};

export default PrivacyIncidentDetailsPage;

