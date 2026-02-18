"use client";

import React from "react";
import CreateRegulatorySubmission from "@/components/app/regulatorySubmissions/create/CreateRegulatorySubmission";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateRegulatorySubmissionPage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.REGULATORY_SUBMISSIONS_CREATE}>
      <CreateRegulatorySubmission />
    </PermissionPage>
  );
};

export default CreateRegulatorySubmissionPage;

