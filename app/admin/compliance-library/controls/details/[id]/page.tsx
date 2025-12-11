"use client"


import React from 'react'
import ControlsDetails from '@/components/admin/controls/controlDetail/ControlsDetails'

interface ControlDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: ControlDetailsPageProps) => {
  const { id } = await params;

  return (
    <div>
      <div className='flex items-center justify-between mt-2 mb-10'>
        <h1 className="font-bold text-3xl text-neutral-900">Control Details</h1>
      </div>
      <ControlsDetails controlId={id} />
    </div>
  )
}

export default page
