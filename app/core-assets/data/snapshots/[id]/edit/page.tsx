

import React from "react";
import EditDatasetSnapshot from "@/components/app/datasetSnapshots/edit/EditDatasetSnapshot";

interface PageProps {
  params: Promise<{ id: string }>
}

const EditSnapshotPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return <EditDatasetSnapshot snapshotId={id} />;
};

export default EditSnapshotPage;


