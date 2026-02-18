import React from "react";
import CreateDPIA from "@/components/app/dpia/create/CreateDPIA";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DPIA_CREATE}>
      <CreateDPIA />
    </PermissionPage>
  );
};

export default page;


