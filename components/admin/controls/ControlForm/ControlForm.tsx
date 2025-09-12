"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Associations from './Associations'
import Overview from './Overview'
import Guidance from './Guidance'
import SubmissionButtons from './SubmissionButtons'
import { useControl, useControlMutations } from '@/hooks/admin/useControls'
import { CreateControlRequest, UpdateControlRequest } from '@/interfaces/Control'
import { toast } from 'react-toastify'

interface ControlFormData {
    name: string
    code: string
    question: string
    summary: string
    description: string
    framework_ids: string[]
    requirement_ids: string[]
    tag_ids: string[]
}

interface ControlFormProps {
    controlId?: string;
    mode?: 'create' | 'edit';
}

const ControlForm = ({ controlId, mode = 'create' }: ControlFormProps) => {
    const router = useRouter()
    const { control, loading: controlLoading } = useControl(mode === 'edit' ? controlId : undefined)
    const { createControl, updateControl, creating, updating } = useControlMutations()

    const [formData, setFormData] = useState<ControlFormData>({
        name: '',
        code: '',
        question: '',
        summary: '',
        description: '',
        framework_ids: [],
        requirement_ids: [],
        tag_ids: []
    })

    // Initialize form data for edit mode
    useEffect(() => {
        if (mode === 'edit' && control) {
            setFormData({
                name: control.name || '',
                code: control.code || '',
                question: control.question || '',
                summary: control.summary || '',
                description: control.description || '',
                framework_ids: control.frameworks?.map(f => f.id.toString()) || [],
                requirement_ids: control.requirements?.map(r => r.id.toString()) || [],
                tag_ids: control.tags?.map(t => t.id.toString()) || []
            })
        }
    }, [mode, control])

    const handleFieldChange = (field: keyof ControlFormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error('Control name is required')
            return
        }
        if (!formData.code.trim()) {
            toast.error('Control code is required')
            return
        }
        if (formData.framework_ids.length === 0) {
            toast.error('At least one framework must be selected')
            return
        }
        if (formData.requirement_ids.length === 0) {
            toast.error('At least one requirement must be selected')
            return
        }

        const payload = {
            name: formData.name,
            code: formData.code,
            question: formData.question,
            summary: formData.summary,
            description: formData.description,
            framework_ids: formData.framework_ids.map(id => parseInt(id)),
            requirement_ids: formData.requirement_ids.map(id => parseInt(id)),
            tag_ids: formData.tag_ids.map(id => parseInt(id))
        }

        if (mode === 'create') {
            await createControl(payload as CreateControlRequest)
        } else if (mode === 'edit' && controlId) {
            await updateControl(controlId, payload as UpdateControlRequest)
        }
    }

    const handleCancel = () => {
        router.push('/admin/compliance-library/controls')
    }

    const isLoading = creating || updating || (mode === 'edit' && controlLoading)

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
                    loading={isLoading}
                    mode={mode}
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