import CreateCommitteeMembership from '@/components/app/committeeMemberships/create/CreateCommitteeMembership'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_MEMBERSHIPS_CREATE}>
      <CreateCommitteeMembership />
    </PermissionPage>
  )
}

export default page

