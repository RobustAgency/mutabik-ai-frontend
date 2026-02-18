import React from "react";
import EditDatasetSnapshot from "@/components/app/datasetSnapshots/edit/EditDatasetSnapshot";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface PageProps {
  params: Promise<{ id: string }>
}

const EditSnapshotPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.DATASET_SNAPSHOTS_EDIT}>
      <EditDatasetSnapshot snapshotId={Number(id)} />
    </PermissionPage>
  );
};

export default EditSnapshotPage;


