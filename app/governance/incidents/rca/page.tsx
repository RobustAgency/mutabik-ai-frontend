import React from 'react'
import IncidentRootCauseAnalyses from '@/components/app/incidents/rca/IncidentRootCauseAnalyses'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_RCA_VIEW}>
      <div>
        <IncidentRootCauseAnalyses />
      </div>
    </PermissionPage>
  )
}

export default Page

