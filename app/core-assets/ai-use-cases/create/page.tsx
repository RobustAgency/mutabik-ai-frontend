import CraeteUseCases from '@/components/app/useCases/create/CreateUseCases'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.USE_CASES_CREATE}>
      <CraeteUseCases />
    </PermissionPage>
  )
}

export default page
