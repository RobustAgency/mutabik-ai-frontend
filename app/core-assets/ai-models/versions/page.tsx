
import React from "react";
import AiModelVersions from "@/components/app/aiModel/versions/AiModelVersions";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_MODEL_VERSIONS_VIEW}>
      <AiModelVersions />
    </PermissionPage>
  );
};

export default Page;