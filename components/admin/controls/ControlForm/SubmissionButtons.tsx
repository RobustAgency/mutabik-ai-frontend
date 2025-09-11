import { Button } from '@/components/ui/button'
import React from 'react'

interface SubmissionButtonsProps {
    onSubmit: () => void
    onCancel: () => void
}

const SubmissionButtons = ({ onSubmit, onCancel }: SubmissionButtonsProps) => {
    return (
        <div className='flex gap-3'>
            <Button onClick={onSubmit}>Create</Button>
            <Button variant={'outline'} onClick={onCancel}>Cancel</Button>
        </div>
    )
}

export default SubmissionButtons