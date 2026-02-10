import React from 'react'
import AiCommittees from '@/components/app/aiCommittees/AiCommittees'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_COMMITTEES_VIEW}>
      <AiCommittees />
    </PermissionPage>
  )
}

export default Page

