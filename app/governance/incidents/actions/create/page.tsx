import CreateIncidentActionWizard from '@/components/app/incidents/actions/create/CreateIncidentActionWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_ACTIONS_CREATE}>
      <CreateIncidentActionWizard />
    </PermissionPage>
  )
}

export default page

