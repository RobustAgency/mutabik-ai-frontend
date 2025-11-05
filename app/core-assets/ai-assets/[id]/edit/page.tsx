
import React, { use } from "react";
import EditAiAsset from '@/components/app/ai-assets/edit/EditAiAsset'

interface AiAssetEditPageProps {
  params: Promise<{ id: string }>;
}

const AiAssetEditPage = ({ params }: AiAssetEditPageProps) => {
  const { id } = use(params);
  return <EditAiAsset aiAssetId={id} />;
};

export default AiAssetEditPage;

