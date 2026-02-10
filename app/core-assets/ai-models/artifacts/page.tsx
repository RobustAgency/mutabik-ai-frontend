import React from "react";
import ArtifactsMain from "@/components/app/aiModel/artifacts/ArtifactsMain";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_MODEL_ARTIFACTS_VIEW}>
      <ArtifactsMain />
    </PermissionPage>
  );
};

export default Page;