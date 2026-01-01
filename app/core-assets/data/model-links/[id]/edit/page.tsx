import React from "react";
import EditModelDatasetLinkWizard from "@/components/app/modelDatasetLinks/edit/EditModelDatasetLinkWizard";

interface PageProps {
  params: Promise<{ id: string }>
}

const EditModelDatasetLinkPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return <EditModelDatasetLinkWizard linkId={Number(id)} />;
};

export default EditModelDatasetLinkPage;

