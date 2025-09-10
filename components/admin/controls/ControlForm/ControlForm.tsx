"use client"
import React, { useState } from 'react'
import Associations from './Associations'
import Overview from './Overview'
import Guidance from './Guidance'
import SubmissionButtons from './SubmissionButtons'

interface ControlFormData {
    title: string
    code: string
    question: string
    summary: string
    description: string
    context: string
    linkedFrameworks: string[]
    linkedRequirements: string[]
    tags: string[]
}

const ControlForm = () => {
    const [formData, setFormData] = useState<ControlFormData>({
        title: 'Responses to high-priority AI risks are properly documented',
        code: 'MRF-391',
        question: '<p>Have the objectives for the project been specified and documented?</p>',
        summary: '<p>Define and document project objectives, considering the organisation-wide objectives. Indicate the source of project objectives and associated stakeholders.</p>',
        description: '',
        context: '<p>Defining and documenting the high-level objectives of your AI project is a pivotal step in ensuring your AI project is responsibly developed, deployed, aligns with your business goals. These objectives should possess the qualities of clarity, measurability, and achievability.</p><p>Moreover, these high-level objectives play a dual role.</p><p>First, they define the foundation for deriving related requirements, encompassing regulations, ethical frameworks, organisational policies, and software best practices...</p>',
        linkedFrameworks: ['MFE-3', 'MFE-7'],
        linkedRequirements: ['MCF-182', 'MCF-182-X', 'MCF-322', 'MCF-104'],
        tags: ['lifecycle-design-development', 'scope-project']
    })

    const handleFieldChange = (field: keyof ControlFormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        console.log('Form Data:', formData)
        alert('Control created successfully!')
    }

    const handleCancel = () => {
        setFormData({
            title: '',
            code: '',
            question: '',
            summary: '',
            description: '',
            context: '',
            linkedFrameworks: [],
            linkedRequirements: [],
            tags: []
        })
    }

    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='col-span-full lg:col-span-2 space-y-6'>
                <Overview
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />
                <Guidance
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />
                <SubmissionButtons
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
            <div className='col-span-full lg:col-span-1'>
                <Associations
                    formData={formData}
                    onFieldChange={handleFieldChange}
                />
            </div>
        </div>
    )
}

export default ControlForm