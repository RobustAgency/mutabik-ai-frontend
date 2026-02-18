import React, { use } from "react";
import EditAiAsset from '@/components/app/ai-assets/edit/EditAiAsset'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface AiAssetEditPageProps {
  params: Promise<{ id: string }>;
}

const AiAssetEditPage = ({ params }: AiAssetEditPageProps) => {
  const { id } = use(params);
  return (
    <PermissionPage permission={PERMISSIONS.AI_ASSETS_EDIT}>
      <EditAiAsset aiAssetId={id} />
    </PermissionPage>
  );
};

export default AiAssetEditPage;

