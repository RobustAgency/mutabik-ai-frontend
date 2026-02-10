import EditAiIncidentWizard from "@/components/app/incidents/edit/EditAiIncidentWizard";
import React, { use } from "react";

interface EditAiIncidentPageProps {
  params: Promise<{ id: string }>;
}

const EditAiIncidentPage = ({ params }: EditAiIncidentPageProps) => {
  const { id } = use(params);
  const incidentId = Number(id);
  
  if (Number.isNaN(incidentId)) {
    return <div>Invalid incident ID</div>;
  }

  return <EditAiIncidentWizard incidentId={incidentId} />;
};

export default EditAiIncidentPage;
