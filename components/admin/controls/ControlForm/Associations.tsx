import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import LinkedFrameWorks from './LinkedFrameWorks'
import LinkedRequirements from './LinkedRequirements'
import LinkedTags from './LinkedTags'

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
                    value={formData.linkedFrameworks}
                    onChange={(value) => onFieldChange('linkedFrameworks', value)}
                />
                <LinkedRequirements
                    value={formData.linkedRequirements}
                    onChange={(value) => onFieldChange('linkedRequirements', value)}
                />
                <LinkedTags
                    value={formData.tags}
                    onChange={(value) => onFieldChange('tags', value)}
                />
            </CardContent>
        </Card>
    )
}

export default Associations