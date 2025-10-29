import EditAiModelVersion from '@/components/app/aiModel/versions/EditAiModelVersion'
import React from 'react'

interface PageProps {
    params: {
        id: string
    }
}

const page = ({ params }: PageProps) => {
    return (
        <div>
            <EditAiModelVersion versionId={parseInt(params.id)} />
        </div>
    )
}

export default page
