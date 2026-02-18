import CreateIncidentRCAWizard from '@/components/app/incidents/rca/create/CreateIncidentRCAWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_RCA_CREATE}>
      <CreateIncidentRCAWizard />
    </PermissionPage>
  )
}

export default page

