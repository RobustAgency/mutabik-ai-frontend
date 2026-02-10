import React from 'react'
import CommitteeActions from '@/components/app/committeeActions/CommitteeActions'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_ACTIONS_VIEW}>
      <CommitteeActions />
    </PermissionPage>
  )
}

export default Page

