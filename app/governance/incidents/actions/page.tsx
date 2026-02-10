import React from 'react'
import IncidentActions from '@/components/app/incidents/actions/IncidentActions'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.INCIDENT_ACTIONS_VIEW}>
      <div>
        <IncidentActions />
      </div>
    </PermissionPage>
  )
}

export default Page

