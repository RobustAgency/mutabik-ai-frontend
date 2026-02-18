import CreateCAPAWizard from '@/components/app/incidents/capa/create/CreateCAPAWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.CAPA_CREATE}>
      <CreateCAPAWizard />
    </PermissionPage>
  )
}

export default page

