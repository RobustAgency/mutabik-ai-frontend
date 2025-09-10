import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Description from '@/components/custom/Description'
import { Notebook, StickyNote } from 'lucide-react'

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

interface OverviewProps {
    formData: ControlFormData
    onFieldChange: (field: keyof ControlFormData, value: string | string[]) => void
}

const Overview = ({ formData, onFieldChange }: OverviewProps) => {
    return (
        <Card className='gap-0 !pt-0'>
            <CardHeader className='border-b !py-4 !gap-0'>
                <div className='flex items-center gap-2'>
                    <StickyNote />
                    <CardTitle className='text-lg font-semibold !py-0'>Overview</CardTitle>
                </div>
            </CardHeader>
            <CardContent className='py-4 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Responses to high-priority AI risks are properly documented"
                            value={formData.title}
                            onChange={(e) => onFieldChange('title', e.target.value)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            placeholder="MRF-391"
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