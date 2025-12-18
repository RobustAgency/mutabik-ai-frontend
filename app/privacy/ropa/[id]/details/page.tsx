import ROPADetails from '@/components/app/recordOfProcessingActivities/details/ROPADetails'
import React from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const page = async ({ params }: PageProps) => {
  const { id } = await params
  return (
    <ROPADetails activityId={id} />
  )
}

export default page

