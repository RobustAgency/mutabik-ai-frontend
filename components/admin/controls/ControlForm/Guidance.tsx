import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Description from '@/components/custom/Description'
import { BookOpen } from 'lucide-react'

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

interface GuidanceProps {
    formData: ControlFormData
    onFieldChange: (field: keyof ControlFormData, value: string | string[]) => void
}

const Guidance = ({ formData, onFieldChange }: GuidanceProps) => {
    return (
        <Card className='gap-0 !pt-0'>
            <CardHeader className='border-b !py-4 !gap-0'>
                <div className='flex items-center gap-2'>
                    <BookOpen />
                    <CardTitle className='text-lg font-semibold !py-0'>Guidance</CardTitle>
                </div>
            </CardHeader>
            <CardContent className='py-4 space-y-6'>
                <Description
                    value={formData.description}
                    onChange={(value) => onFieldChange('description', value)}
                />
            </CardContent>
        </Card>
    )
}

export default Guidance