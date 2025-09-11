import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Description from '@/components/custom/Description'
import { SquareChartGantt } from 'lucide-react'

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

interface OverviewProps {
    formData: ControlFormData
    onFieldChange: (field: keyof ControlFormData, value: string | string[]) => void
}

const Overview = ({ formData, onFieldChange }: OverviewProps) => {
    return (
        <Card className='gap-0 !pt-0'>
            <CardHeader className='border-b !py-4 !gap-0 px-5'>
                <div className='flex items-center gap-2'>
                    <SquareChartGantt className="w-[24px] h-[24px] text-[#000000]" />
                    <CardTitle className='text-lg font-semibold !py-0'>Overview</CardTitle>
                </div>
            </CardHeader>
            <CardContent className='py-4 space-y-6 px-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Control Name"
                            value={formData.name}
                            onChange={(e) => onFieldChange('name', e.target.value)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            placeholder="Code"
                            value={formData.code}
                            onChange={(e) => onFieldChange('code', e.target.value)}
                        />
                    </div>
                </div>

                <Description
                    title='Question'
                    value={formData.question}
                    onChange={(value) => onFieldChange('question', value)}
                />

                <Description
                    title="Summary"
                    value={formData.summary}
                    onChange={(value) => onFieldChange('summary', value)}
                />
            </CardContent>
        </Card>
    )
}

export default Overview