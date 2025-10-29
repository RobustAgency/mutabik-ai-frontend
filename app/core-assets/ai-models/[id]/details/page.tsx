import AiModelDetails from '@/components/app/aiModel/AiModelDetails/AiModelDetails'
import React from 'react'

interface PageProps {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: PageProps) => {
    const { id } = await params

    return (
        <div>
            <AiModelDetails aiModelId={id} />
        </div>
    )
}

export default Page