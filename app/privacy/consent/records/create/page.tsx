import React from "react";
import CreateConsentRecord from "@/components/app/consentRecords/create/CreateConsentRecord";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.CONSENT_RECORDS_CREATE}>
      <CreateConsentRecord />
    </PermissionPage>
  );
};

export default page;


