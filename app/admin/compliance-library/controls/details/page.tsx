import React from 'react'
import ControlsDetails from '@/components/admin/controls/controlDetail/ControlsDetails'
import Breadcrumbs from '@/components/custom/Breadcrumbs';

const page = () => {
     const breadcrumbItems = [
    { label: 'Frameworks' },
    { label: 'List' },
  ];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className='flex items-center justify-between mt-2 mb-10'>
        <h1 className="font-bold text-4xl text-neutral-900">Frameworks</h1>
      </div>
      <ControlsDetails />
    </div>
  )
}

export default page
