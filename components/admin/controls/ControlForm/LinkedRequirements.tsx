import React from 'react'
import { Label } from '@/components/ui/label'
import { CustomMultiSelect } from '@/components/custom/CustomMultiSelect'

interface LinkedRequirementsProps {
    value: string[]
    onChange: (value: string[]) => void
}

// Mock data based on the screenshot
const requirementOptions = [
    { value: 'MCF-182', label: 'MCF-182' },
    { value: 'MCF-182-X', label: 'MCF-182 X' },
    { value: 'MCF-322', label: 'MCF-322' },
    { value: 'MCF-104', label: 'MCF-104' },
    { value: 'MCF-205', label: 'MCF-205' },
]

const LinkedRequirements = ({ value, onChange }: LinkedRequirementsProps) => {
    return (
        <div className='space-y-2'>
            <Label>Linked Requirements <span className='text-red-500'>*</span></Label>
            <CustomMultiSelect
                options={requirementOptions}
                value={value}
                onChange={onChange}
                placeholder="Select option"
            />
        </div>
    )
}

export default LinkedRequirements