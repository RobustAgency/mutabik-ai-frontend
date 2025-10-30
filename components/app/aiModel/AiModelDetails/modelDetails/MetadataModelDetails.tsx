import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/utils/formatDate'

interface MetadataModelDetailsProps {
    aiModel: {
        created_at: string | null;
        updated_at: string | null;
    };
}

const MetadataModelDetails: React.FC<MetadataModelDetailsProps> = ({ aiModel }) => {
    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Created</p>
                        <p className="font-sans text-sm text-[#667085]">{aiModel.created_at ? formatDate(aiModel.created_at) : '-'}</p>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Last Updated</p>
                        <p className="font-sans text-sm text-[#667085]">{aiModel.updated_at ? formatDate(aiModel.updated_at) : '-'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MetadataModelDetails