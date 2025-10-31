export const runtime = 'edge';

import EditAiModelVersion from '@/components/app/aiModel/versions/EditAiModelVersion'
import React from 'react'

interface PageProps {
    params: Promise<{ id: string }>
}

const page = async ({ params }: PageProps) => {
    const { id } = await params
    return (
        <div>
            <EditAiModelVersion versionId={parseInt(id)} />
        </div>
    )
}

export default page
