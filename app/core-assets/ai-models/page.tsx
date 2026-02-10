import React from "react";
import AiModels from "@/components/app/aiModel/AiModels";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_MODELS_VIEW}>
      <AiModels />
    </PermissionPage>
  );
};

export default Page;