import CreateDSAR from "@/components/app/dataSubjectRequestAccesses/create/CreateDSAR";
import React from "react";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DSAR_CREATE}>
      <CreateDSAR />
    </PermissionPage>
  );
};

export default page;


