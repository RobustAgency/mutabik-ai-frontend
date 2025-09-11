import React, { useState, useEffect, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { CustomMultiSelect } from '@/components/custom/CustomMultiSelect'
import { useTags } from '@/hooks/admin/useTags'

interface LinkedTagsProps {
    value: string[]
    onChange: (value: string[]) => void
}

const LinkedTags = ({ value, onChange }: LinkedTagsProps) => {
    const filters = useMemo(() => ({ per_page: 100 }), []);
    const { tags, loading } = useTags(filters);
    const [tagOptions, setTagOptions] = useState<{ value: string; label: string }[]>([])

    useEffect(() => {
        if (tags && tags.length > 0) {
            const options = tags.map(tag => ({
                value: tag.id.toString(),
                label: tag.name
            }))
            setTagOptions(options)
        }
    }, [tags])

    return (
        <div className='space-y-2'>
            <Label>Tags</Label>
            <CustomMultiSelect
                options={tagOptions}
                value={value}
                onChange={onChange}
                placeholder={loading ? "Loading tags..." : "Select tags"}
            />
        </div>
    )
}

export default LinkedTags