import React from 'react'
import ProjectsTable from '@/components/app/projects/ProjectsTable'
import { PermissionPage } from '@/components/auth/PermissionPage'
import { PERMISSIONS } from '@/constants/permissions'

const ProjectsPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.PROJECTS_VIEW}>
      <React.Fragment>
        <ProjectsTable />
      </React.Fragment>
    </PermissionPage>
  )
}

export default ProjectsPage
