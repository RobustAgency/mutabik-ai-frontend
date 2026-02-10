import React from 'react'
import IncidentAlerts from '@/components/app/incidents/alerts/IncidentAlerts'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_ALERTS_VIEW}>
      <div>
        <IncidentAlerts />
      </div>
    </PermissionPage>
  )
}

export default Page

