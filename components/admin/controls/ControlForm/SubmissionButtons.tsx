import { Button } from '@/components/ui/button'
import React from 'react'

interface SubmissionButtonsProps {
    onSubmit: () => void
    onCancel: () => void
    loading?: boolean
    mode?: 'create' | 'edit'
}

const SubmissionButtons = ({ onSubmit, onCancel, loading = false, mode = 'create' }: SubmissionButtonsProps) => {
    return (
        <div className='flex gap-3'>
            <Button 
                onClick={onSubmit}
                disabled={loading}
                className="bg-primary text-white px-6 h-10 rounded-lg font-medium"
            >
                {loading ? (
                    mode === 'create' ? 'Creating...' : 'Updating...'
                ) : (
                    mode === 'create' ? 'Create' : 'Update'
                )}
            </Button>
            <Button 
                variant='outline' 
                onClick={onCancel}
                disabled={loading}
                className="px-6 h-10 rounded-lg"
            >
                Cancel
            </Button>
        </div>
    )
}

export default SubmissionButtons