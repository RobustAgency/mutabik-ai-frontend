import React from 'react'
import CommitteeMemberships from '@/components/app/committeeMemberships/CommitteeMemberships'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_MEMBERSHIPS_VIEW}>
      <CommitteeMemberships />
    </PermissionPage>
  )
}

export default Page

