import CreateAiCommittee from '@/components/app/aiCommittees/create/CreateAiCommittee'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_COMMITTEES_CREATE}>
      <CreateAiCommittee />
    </PermissionPage>
  )
}

export default page

