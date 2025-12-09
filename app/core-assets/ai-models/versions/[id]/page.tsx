

import AiModelVersionDetails from '@/components/app/aiModel/versions/AiModelVersionDetails'
import React from 'react'

interface PageProps {
    params: Promise<{ id: string }>
}

const page = async ({ params }: PageProps) => {
    const { id } = await params
    return (
        <div>
            <AiModelVersionDetails versionId={parseInt(id)} />
        </div>
    )
}

export default page
