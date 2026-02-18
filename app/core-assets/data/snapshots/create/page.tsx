import CreateDatasetSnapshotWizard from "@/components/app/datasetSnapshots/create/CreateDatasetSnapshotWizard";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateDatasetSnapshotPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DATASET_SNAPSHOTS_CREATE}>
      <CreateDatasetSnapshotWizard />
    </PermissionPage>
  );
};

export default CreateDatasetSnapshotPage;
