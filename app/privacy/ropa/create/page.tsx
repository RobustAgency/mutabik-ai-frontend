import CreateROPA from '@/components/app/recordOfProcessingActivities/create/CreateROPA'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.ROPA_CREATE}>
      <CreateROPA />
    </PermissionPage>
  )
}

export default page

