"use client";

import { use } from "react";
import AiAssetDetails from '@/components/app/ai-assets/details/AiAssetDetails'

interface AiAssetDetailsPageProps {
  params: Promise<{ id: string }>;
}

const AiAssetDetailsPage = ({ params }: AiAssetDetailsPageProps) => {
  const { id } = use(params);
  return <AiAssetDetails aiAssetId={id} />;
};

export default AiAssetDetailsPage;


