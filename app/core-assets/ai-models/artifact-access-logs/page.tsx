import React from "react";
import ArtifactAccessLogsList from "@/components/app/aiModel/artifactAccessLogs/ArtifactAccessLogsList";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.ARTIFACT_ACCESS_LOGS_VIEW}>
      <ArtifactAccessLogsList />
    </PermissionPage>
  );
};

export default Page;

