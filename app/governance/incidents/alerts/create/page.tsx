import CreateIncidentAlertWizard from '@/components/app/incidents/alerts/create/CreateIncidentAlertWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_ALERTS_CREATE}>
      <CreateIncidentAlertWizard />
    </PermissionPage>
  )
}

export default page

