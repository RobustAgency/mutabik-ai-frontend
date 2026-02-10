import React from 'react'
import RecordOfProcessingActivities from '@/components/app/recordOfProcessingActivities/RecordOfProcessingActivities'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.ROPA_VIEW}>
      <RecordOfProcessingActivities />
    </PermissionPage>
  )
}

export default Page

