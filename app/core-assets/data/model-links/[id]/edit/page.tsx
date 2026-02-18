import React from "react";
import EditModelDatasetLinkWizard from "@/components/app/modelDatasetLinks/edit/EditModelDatasetLinkWizard";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface PageProps {
  params: Promise<{ id: string }>
}

const EditModelDatasetLinkPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <PermissionPage permission={PERMISSIONS.AI_MODEL_DATASETS_EDIT}>
      <EditModelDatasetLinkWizard linkId={Number(id)} />
    </PermissionPage>
  );
};

export default EditModelDatasetLinkPage;

