import React from "react";
import ModelDatasetLinkDetails from "@/components/app/modelDatasetLinks/details/ModelDatasetLinkDetails";

interface PageProps {
  params: Promise<{ id: string }>
}

const ModelDatasetLinkDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return <ModelDatasetLinkDetails linkId={Number(id)} />;
};

export default ModelDatasetLinkDetailsPage;

