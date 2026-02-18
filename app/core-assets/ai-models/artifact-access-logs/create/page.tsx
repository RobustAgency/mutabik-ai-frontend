"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ArtifactAccessLogForm from "@/components/app/aiModel/artifactAccessLogs/ArtifactAccessLogForm";
import { useCreateArtifactAccessLogMutation } from "@/app/lib/features/artifactAccessLogsApi";
import type { CreateArtifactAccessLogData } from "@/service/app/artifactAccessLogs";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  const router = useRouter();
  const [createLog, { isLoading }] = useCreateArtifactAccessLogMutation();

  return (
    <PermissionPage permission={PERMISSIONS.ARTIFACT_ACCESS_LOGS_CREATE}>
      <ArtifactAccessLogForm
        loading={isLoading}
        onSubmit={async (data: CreateArtifactAccessLogData) => {
          const result = await createLog(data).unwrap();
          if (!result.error) {
            router.push("/core-assets/ai-models/artifact-access-logs");
          }
        }}
      />
    </PermissionPage>
  );
};

export default Page;

