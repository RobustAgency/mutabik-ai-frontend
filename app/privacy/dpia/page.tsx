import React from "react";
import DPIAList from "@/components/app/dpia/DPIAList";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DPIA_VIEW}>
      <DPIAList />
    </PermissionPage>
  );
};

export default Page;


