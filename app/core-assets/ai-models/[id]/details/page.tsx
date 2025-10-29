import AiModelDetails from '@/components/app/aiModel/AiModelDetails/AiModelDetails'
import React from 'react'

interface PageProps {
    params: { id: string }
}

const Page = ({ params }: PageProps) => {
    return (
        <div>
            <AiModelDetails aiModelId={params.id} />
        </div>
    )
}

export default Page