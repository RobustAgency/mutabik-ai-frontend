export const runtime = 'edge';

import ControlForm from '@/components/admin/controls/ControlForm/ControlForm';
import Breadcrumbs from '@/components/custom/Breadcrumbs'
import React from 'react'

const breadcrumbItems = [
    { label: 'Controls', href: '/admin/compliance-library/controls' },
    { label: 'Create' },
];

const CreateControlPage = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-start">
            <Breadcrumbs items={breadcrumbItems} />
            <h1 className="text-3xl text-[#171717] font-bold mt-3 mb-6">Create Control</h1>
            <ControlForm />
        </div>
    )
}

export default CreateControlPage