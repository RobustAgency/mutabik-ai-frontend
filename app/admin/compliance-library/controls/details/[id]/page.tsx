"use client"


import React from 'react'
import ControlsDetails from '@/components/admin/controls/controlDetail/ControlsDetails'
import Breadcrumbs from '@/components/custom/Breadcrumbs';

interface ControlDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: ControlDetailsPageProps) => {
  const { id } = await params;
  const breadcrumbItems = [
    { label: 'Controls', href: "/admin/compliance-library/controls" },
    { label: 'Details' },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className='flex items-center justify-between mt-2 mb-10'>
        <h1 className="font-bold text-3xl text-neutral-900">Control Details</h1>
      </div>
      <ControlsDetails controlId={id} />
    </div>
  )
}

export default page
