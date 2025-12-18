"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PrivacyIncidentForm } from "../shared/PrivacyIncidentForm";
import { useCreatePrivacyIncidentMutation } from "@/app/lib/features/privacyIncidentsApi";
import type { CreatePrivacyIncidentData } from "@/interfaces/PrivacyIncident";

const CreatePrivacyIncident: React.FC = () => {
  const router = useRouter();
  const [createIncident, { isLoading }] = useCreatePrivacyIncidentMutation();

  const handleSubmit = async (data: CreatePrivacyIncidentData | Partial<CreatePrivacyIncidentData>) => {
    await createIncident(data as CreatePrivacyIncidentData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/privacy-incidents");
  };

  return (
    <PrivacyIncidentForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Privacy Incident"
      description="Report a new privacy or data breach incident"
    />
  );
};

export default CreatePrivacyIncident;

