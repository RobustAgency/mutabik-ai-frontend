import React from 'react'
import CommitteeMeetings from '@/components/app/committeeMeetings/CommitteeMeetings'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_MEETINGS_VIEW}>
      <CommitteeMeetings />
    </PermissionPage>
  )
}

export default Page

