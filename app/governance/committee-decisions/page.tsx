import React from 'react'
import CommitteeDecisions from '@/components/app/committeeDecisions/CommitteeDecisions'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_DECISIONS_VIEW}>
      <CommitteeDecisions />
    </PermissionPage>
  )
}

export default Page

