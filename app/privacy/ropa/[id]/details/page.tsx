import ROPADetails from '@/components/app/recordOfProcessingActivities/details/ROPADetails'
import React from 'react'

interface PageProps {
  params: {
    id: string
  }
}

const page = ({ params }: PageProps) => {
  return (
    <ROPADetails activityId={params.id} />
  )
}

export default page

