import React from "react";
import Datasets from "@/components/app/datasets/Datasets";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DATASETS_VIEW}>
      <div>
        <Datasets />
      </div>
    </PermissionPage>
  );
};

export default Page;

