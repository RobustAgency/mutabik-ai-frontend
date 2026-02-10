import React from "react";
import Stakeholders from "@/components/app/stakeholders/Stakeholders";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.STAKEHOLDERS_VIEW}>
      <div>
        <Stakeholders />
      </div>
    </PermissionPage>
  );
};

export default Page;
