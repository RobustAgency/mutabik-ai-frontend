"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PrivacyIncidentForm } from "../shared/PrivacyIncidentForm";
import {
  useGetPrivacyIncidentQuery,
  useUpdatePrivacyIncidentMutation,
} from "@/app/lib/features/privacyIncidentsApi";
import type { CreatePrivacyIncidentData } from "@/interfaces/PrivacyIncident";

interface EditPrivacyIncidentProps {
  id: number;
}

const EditPrivacyIncident: React.FC<EditPrivacyIncidentProps> = ({ id }) => {
  const router = useRouter();
  const { data: incident, isLoading: isLoadingIncident } =
    useGetPrivacyIncidentQuery(id);
  const [updateIncident, { isLoading: isUpdating }] =
    useUpdatePrivacyIncidentMutation();

  const handleSubmit = async (data: Partial<CreatePrivacyIncidentData>) => {
    await updateIncident({ id, data }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/privacy-incidents");
  };

  if (isLoadingIncident) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Loading privacy incident...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Privacy incident not found</p>
      </div>
    );
  }

  return (
    <PrivacyIncidentForm
      mode="edit"
      initialData={incident}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Privacy Incident"
      description={`Update details for ${incident.incident_code}`}
    />
  );
};

export default EditPrivacyIncident;

