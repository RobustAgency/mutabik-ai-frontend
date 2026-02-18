import CreateDatasetSubjectPopulation from "@/components/app/datasetSubjectPopulation/create/CreateDatasetSubjectPopulation";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateDatasetSubjectPopulationPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DATASET_SUBJECT_POPULATIONS_CREATE}>
      <CreateDatasetSubjectPopulation />
    </PermissionPage>
  );
};

export default CreateDatasetSubjectPopulationPage;

