import CreateCommitteeDecision from '@/components/app/committeeDecisions/create/CreateCommitteeDecision'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_DECISIONS_CREATE}>
      <CreateCommitteeDecision />
    </PermissionPage>
  )
}

export default page

