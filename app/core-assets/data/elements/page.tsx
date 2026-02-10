import React from "react";
import DataElements from "@/components/app/dataElements/DataElements";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DATA_ELEMENTS_VIEW}>
      <div>
        <DataElements />
      </div>
    </PermissionPage>
  );
};

export default Page;

