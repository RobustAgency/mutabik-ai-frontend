import React from "react";
import ConsentRecords from "@/components/app/consentRecords/ConsentRecords";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.CONSENT_RECORDS_VIEW}>
      <ConsentRecords />
    </PermissionPage>
  );
};

export default Page;


