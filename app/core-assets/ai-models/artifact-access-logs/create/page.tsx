"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ArtifactAccessLogForm from "@/components/app/aiModel/artifactAccessLogs/ArtifactAccessLogForm";
import { useCreateArtifactAccessLogMutation } from "@/app/lib/features/artifactAccessLogsApi";
import type { CreateArtifactAccessLogData } from "@/service/app/artifactAccessLogs";

const Page = () => {
  const router = useRouter();
  const [createLog, { isLoading }] = useCreateArtifactAccessLogMutation();

  return (
    <ArtifactAccessLogForm
      loading={isLoading}
      onSubmit={async (data: CreateArtifactAccessLogData) => {
        const result = await createLog(data).unwrap();
        if (!result.error) {
          router.push("/core-assets/ai-models/artifact-access-logs");
        }
      }}
    />
  );
};

export default Page;

