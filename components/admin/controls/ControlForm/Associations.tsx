import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import LinkedFrameWorks from './LinkedFrameWorks'
import LinkedRequirements from './LinkedRequirements'
import LinkedTags from './LinkedTags'

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

interface AssociationsProps {
    formData: ControlFormData
    onFieldChange: (field: keyof ControlFormData, value: string | string[]) => void
}

const Associations = ({ formData, onFieldChange }: AssociationsProps) => {
    return (
        <Card className='gap-0 !pt-0'>
            <CardHeader className='border-b !py-4 !gap-0 px-5'>
                <CardTitle className='text-lg font-semibold !py-0'>Associations</CardTitle>
            </CardHeader>
            <CardContent className='py-4 space-y-6 px-5'>
                <LinkedFrameWorks
                    value={formData.framework_ids}
                    onChange={(value) => onFieldChange('framework_ids', value)}
                />
                <LinkedRequirements
                    value={formData.requirement_ids}
                    onChange={(value) => onFieldChange('requirement_ids', value)}
                />
                <LinkedTags
                    value={formData.tag_ids}
                    onChange={(value) => onFieldChange('tag_ids', value)}
                />
            </CardContent>
        </Card>
    )
}

export default Associations