import React from "react";
import DataSubjectRequestAccesses from "@/components/app/dataSubjectRequestAccesses/DataSubjectRequestAccesses";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DSAR_VIEW}>
      <DataSubjectRequestAccesses />
    </PermissionPage>
  );
};

export default Page;


