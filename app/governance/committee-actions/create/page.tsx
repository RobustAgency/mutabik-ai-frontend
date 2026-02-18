import CreateCommitteeAction from '@/components/app/committeeActions/create/CreateCommitteeAction'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_ACTIONS_CREATE}>
      <CreateCommitteeAction />
    </PermissionPage>
  )
}

export default page

