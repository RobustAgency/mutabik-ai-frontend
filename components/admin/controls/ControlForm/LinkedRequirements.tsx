import React, { useState, useEffect, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { CustomMultiSelect } from '@/components/custom/CustomMultiSelect'
import { useRequirements } from '@/hooks/admin/useRequirements'

interface LinkedRequirementsProps {
    value: string[]
    onChange: (value: string[]) => void
}

const LinkedRequirements = ({ value, onChange }: LinkedRequirementsProps) => {
    const filters = useMemo(() => ({ per_page: 100 }), []);
    const { requirements, loading } = useRequirements(filters);
    const [requirementOptions, setRequirementOptions] = useState<{ value: string; label: string }[]>([])

    useEffect(() => {
        if (requirements && requirements.length > 0) {
            const options = requirements.map(requirement => ({
                value: requirement.id.toString(),
                label: `${requirement.reference}${requirement.requirement_text ? ` - ${requirement.requirement_text.substring(0, 50)}` : ''}`
            }))
            setRequirementOptions(options)
        }
    }, [requirements])

    return (
        <div className='space-y-2'>
            <Label>Linked Requirements <span className='text-red-500'>*</span></Label>
            <CustomMultiSelect
                options={requirementOptions}
                value={value}
                onChange={onChange}
                placeholder={loading ? "Loading requirements..." : "Select requirements"}
            />
        </div>
    )
}

export default LinkedRequirements