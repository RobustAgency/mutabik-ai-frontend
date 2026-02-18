import CreateCommitteeMeeting from '@/components/app/committeeMeetings/create/CreateCommitteeMeeting'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.COMMITTEE_MEETINGS_CREATE}>
      <CreateCommitteeMeeting />
    </PermissionPage>
  )
}

export default page

