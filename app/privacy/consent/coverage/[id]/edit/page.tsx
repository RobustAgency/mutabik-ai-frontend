"use client";

import { use } from "react";
import EditConsentCoverage from "@/components/app/consentCoverage/edit/EditConsentCoverage";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface EditConsentCoveragePageProps {
  params: Promise<{ id: string }>;
}

const EditConsentCoveragePage = ({ params }: EditConsentCoveragePageProps) => {
  const { id } = use(params);
  return (
    <PermissionPage permission={PERMISSIONS.CONSENT_COVERAGES_EDIT}>
      <EditConsentCoverage coverageId={id} />
    </PermissionPage>
  );
};

export default EditConsentCoveragePage;

