import React from "react";
import DatasetSnapshotDetails from "@/components/app/datasetSnapshots/details/DatasetSnapshotDetails";

interface PageProps {
  params: { id: string };
}

const SnapshotDetailsPage = async ({ params }: PageProps) => {
  const { id } = params;
  return <DatasetSnapshotDetails snapshotId={id} />;
};

export default SnapshotDetailsPage;


