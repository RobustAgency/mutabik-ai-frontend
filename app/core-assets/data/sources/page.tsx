import React from "react";
import DataSources from "@/components/app/dataSources/DataSources";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.DATA_SOURCES_VIEW}>
      <div>
        <DataSources />
      </div>
    </PermissionPage>
  );
};

export default Page;

