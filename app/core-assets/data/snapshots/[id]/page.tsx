import React from "react";
import DatasetSnapshotDetails from "@/components/app/datasetSnapshots/details/DatasetSnapshotDetails";

interface PageProps {
  params: Promise<{ id: string }>
}

const SnapshotDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return <DatasetSnapshotDetails snapshotId={id} />;
};

export default SnapshotDetailsPage;


