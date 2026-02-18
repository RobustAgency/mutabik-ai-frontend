"use client";

import React from "react";
import EditRegulatorySubmission from "@/components/app/regulatorySubmissions/edit/EditRegulatorySubmission";
import { useParams } from "next/navigation";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const EditRegulatorySubmissionPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id || isNaN(Number(id))) {
    return (
      <PermissionPage permission={PERMISSIONS.REGULATORY_SUBMISSIONS_EDIT}>
        <div>Invalid regulatory submission ID</div>
      </PermissionPage>
    );
  }

  return (
    <PermissionPage permission={PERMISSIONS.REGULATORY_SUBMISSIONS_EDIT}>
      <EditRegulatorySubmission id={Number(id)} />
    </PermissionPage>
  );
};

export default EditRegulatorySubmissionPage;

