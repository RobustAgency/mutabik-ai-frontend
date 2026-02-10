import React from 'react'
import IncidentNotifications from '@/components/app/incidents/notifications/IncidentNotifications'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_NOTIFICATIONS_VIEW}>
      <div>
        <IncidentNotifications />
      </div>
    </PermissionPage>
  )
}

export default Page

