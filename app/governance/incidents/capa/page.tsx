import React from 'react'
import CorrectivePreventiveActions from '@/components/app/incidents/capa/CorrectivePreventiveActions'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.CAPA_VIEW}>
      <div>
        <CorrectivePreventiveActions />
      </div>
    </PermissionPage>
  )
}

export default Page

