import UseCaseDetails from '@/components/app/useCases/useCaseDetails/useCaseDetails'
import React from 'react'

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    const { id } = await params;

    return (
        <React.Fragment>
            <UseCaseDetails useCaseId={id} />
        </React.Fragment>
    )
}

export default page