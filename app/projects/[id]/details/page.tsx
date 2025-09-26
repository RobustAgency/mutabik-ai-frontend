import ProjectDetails from '@/components/app/projects/create/projectDetail/ProjectDetail'
import React from 'react'

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  return (
    <React.Fragment>
      <ProjectDetails projectId={params.id} />
    </React.Fragment>
  )
}

export default page
