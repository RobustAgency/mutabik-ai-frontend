import ProjectDetails from '@/components/app/projects/create/projectDetail/ProjectDetail'
import React from 'react'

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  
  return (
    <React.Fragment>
      <ProjectDetails projectId={id} />
    </React.Fragment>
  )
}

export default page