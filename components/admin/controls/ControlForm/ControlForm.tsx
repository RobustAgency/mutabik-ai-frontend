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
    linkedFrameworks: string[]
    linkedRequirements: string[]
    tags: string[]
}

const ControlForm = () => {
    const [formData, setFormData] = useState<ControlFormData>({
        title: '',
        code: '',
        question: '',
        summary: '',
        description: '',
        linkedFrameworks: [],
        linkedRequirements: [],
        tags: []
    })

    const handleFieldChange = (field: keyof ControlFormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = () => {
        console.log('Form Data:', formData)
    }

    const handleCancel = () => {
        setFormData({
            title: '',
            code: '',
            question: '',
            summary: '',
            description: '',
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