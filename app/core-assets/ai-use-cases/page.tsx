import React from "react";
import UseCases from "@/components/app/useCases/UseCases";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.USE_CASES_VIEW}>
      <UseCases />
    </PermissionPage>
  );
};

export default Page;
