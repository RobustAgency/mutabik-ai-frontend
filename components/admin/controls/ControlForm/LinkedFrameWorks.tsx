import React from 'react'
import { Label } from '@/components/ui/label'
import { CustomMultiSelect } from '@/components/custom/CustomMultiSelect'

interface LinkedFrameWorksProps {
    value: string[]
    onChange: (value: string[]) => void
}

// Mock data based on the screenshot
const frameworkOptions = [
    { value: 'MFE-3', label: 'MFE-3' },
    { value: 'MFE-7', label: 'MFE-7' },
    { value: 'MFE-15', label: 'MFE-15' },
    { value: 'MFE-22', label: 'MFE-22' },
    { value: 'MFE-30', label: 'MFE-30' },
]

const LinkedFrameWorks = ({ value, onChange }: LinkedFrameWorksProps) => {
    return (
        <div className='space-y-2'>
            <Label>Linked Frameworks <span className='text-red-500'>*</span></Label>
            <CustomMultiSelect
                options={frameworkOptions}
                value={value}
                onChange={onChange}
                placeholder="Select option"
            />
        </div>
    )
}

export default LinkedFrameWorks