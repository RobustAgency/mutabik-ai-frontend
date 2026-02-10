
import React from "react";
import AiAssets from "@/components/app/ai-assets/AiAssets";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_ASSETS_VIEW}>
      <AiAssets />
    </PermissionPage>
  );
};

export default Page;

