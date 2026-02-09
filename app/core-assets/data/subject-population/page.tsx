

import DatasetSubjectPopulationList from "@/components/app/datasetSubjectPopulation/DatasetSubjectPopulationList";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const DatasetSubjectPopulationPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DATASET_SUBJECT_POPULATIONS_VIEW}>
      <DatasetSubjectPopulationList />
    </PermissionPage>
  );
};

export default DatasetSubjectPopulationPage;

