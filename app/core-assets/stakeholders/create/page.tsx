import { CreateStakeholderWizard } from '@/components/app/stakeholders/create/CreateStakeholderWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.STAKEHOLDERS_CREATE}>
      <CreateStakeholderWizard />
    </PermissionPage>
  )
}

export default page
