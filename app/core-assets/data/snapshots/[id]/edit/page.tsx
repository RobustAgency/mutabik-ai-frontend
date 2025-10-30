import React from "react";
import EditDatasetSnapshot from "@/components/app/datasetSnapshots/edit/EditDatasetSnapshot";

interface PageProps {
  params: { id: string };
}

const EditSnapshotPage = async ({ params }: PageProps) => {
  const { id } = params;
  return <EditDatasetSnapshot snapshotId={id} />;
};

export default EditSnapshotPage;


