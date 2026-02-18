"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ArtifactForm from "@/components/app/aiModel/artifacts/ArtifactForm";
import { useCreateAiModelArtifactMutation } from "@/app/lib/features/aiModelArtifactsApi";
import type { CreateAiModelArtifactData } from "@/service/app/aiModelArtifacts";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  const router = useRouter();
  const [createArtifact, { isLoading }] = useCreateAiModelArtifactMutation();

  return (
    <PermissionPage permission={PERMISSIONS.AI_MODEL_ARTIFACTS_CREATE}>
      <ArtifactForm
        loading={isLoading}
        onSubmit={async (data: CreateAiModelArtifactData) => {
          const result = await createArtifact(data).unwrap();
          if (!result.error) {
            router.push("/core-assets/ai-models/artifacts");
          }
        }}
      />
    </PermissionPage>
  );
};

export default Page;
