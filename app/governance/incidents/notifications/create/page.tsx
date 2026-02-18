import CreateIncidentNotificationWizard from '@/components/app/incidents/notifications/create/CreateIncidentNotificationWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_NOTIFICATIONS_CREATE}>
      <CreateIncidentNotificationWizard />
    </PermissionPage>
  )
}

export default page

