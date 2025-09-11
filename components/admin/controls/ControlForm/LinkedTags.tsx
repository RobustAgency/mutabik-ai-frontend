import React from 'react'
import { Label } from '@/components/ui/label'
import { CustomMultiSelect } from '@/components/custom/CustomMultiSelect'

interface LinkedTagsProps {
    value: string[]
    onChange: (value: string[]) => void
}

// Mock data based on the screenshot
const tagOptions = [
    { value: 'lifecycle-design-development', label: 'Lifecycle: Design & Development' },
    { value: 'scope-project', label: 'Scope: Project' },
    { value: 'ai-safety', label: 'AI Safety' },
    { value: 'risk-management', label: 'Risk Management' },
    { value: 'compliance', label: 'Compliance' },
]

const LinkedTags = ({ value, onChange }: LinkedTagsProps) => {
    return (
        <div className='space-y-2'>
            <Label>Tags</Label>
            <CustomMultiSelect
                options={tagOptions}
                value={value}
                onChange={onChange}
                placeholder="Select option"
            />
        </div>
    )
}

export default LinkedTags