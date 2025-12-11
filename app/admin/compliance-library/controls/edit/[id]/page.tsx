

import ControlForm from '@/components/admin/controls/ControlForm/ControlForm';
import React from 'react'

interface EditControlPageProps {
    params: Promise<{
        id: string;
    }>;
}

const EditControlPage = async ({ params }: EditControlPageProps) => {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-start">
            <h1 className="text-3xl text-[#171717] font-bold mt-3 mb-6">Edit Control</h1>
            <ControlForm controlId={id} mode="edit" />
        </div>
    )
}

export default EditControlPage
