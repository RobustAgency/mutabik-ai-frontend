import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Description from '@/components/custom/Description'
import { BookOpenText } from 'lucide-react'

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

interface GuidanceProps {
    formData: ControlFormData
    onFieldChange: (field: keyof ControlFormData, value: string | string[]) => void
}

const Guidance = ({ formData, onFieldChange }: GuidanceProps) => {
    return (
        <Card className='gap-0 !pt-0'>
            <CardHeader className='border-b !py-4 !gap-0 px-5'>
                <div className='flex items-center gap-2'>
                    <BookOpenText className="w-[24px] h-[24px] text-[#000000]" />
                    <CardTitle className='text-lg font-semibold !py-0'>Guidance</CardTitle>
                </div>
            </CardHeader>
            <CardContent className='py-4 space-y-6 px-5'>
                <Description
                    value={formData.description}
                    onChange={(value) => onFieldChange('description', value)}
                />
            </CardContent>
        </Card>
    )
}

export default Guidance