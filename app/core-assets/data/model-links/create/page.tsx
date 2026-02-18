import CreateModelDatasetLinkWizard from "@/components/app/modelDatasetLinks/create/CreateModelDatasetLinkWizard";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateModelDatasetLinkPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_MODEL_DATASETS_CREATE}>
      <CreateModelDatasetLinkWizard />
    </PermissionPage>
  );
};

export default CreateModelDatasetLinkPage;

