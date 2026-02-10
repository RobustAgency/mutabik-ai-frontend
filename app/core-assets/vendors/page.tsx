import React from "react";
import Vendors from "@/components/app/vendors/Vendors";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.VENDORS_VIEW}>
      <div>
        <Vendors />
      </div>
    </PermissionPage>
  );
};

export default Page;

