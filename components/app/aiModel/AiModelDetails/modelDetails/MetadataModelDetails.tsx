import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/utils/formatDate'
import { AiModel } from '@/service/app/aiModels';

interface MetadataModelDetailsProps {
    aiModel: AiModel;
}

const MetadataModelDetails: React.FC<MetadataModelDetailsProps> = ({ aiModel }) => {
    // Backward compatibility: support both new and old field names
    const createdDate = (aiModel as any).created_date || (aiModel as any).created_at;
    const updatedDate = (aiModel as any).updated_date || (aiModel as any).updated_at;
    const createdBy = (aiModel as any).created_by;
    const currentVersionId = (aiModel as any).current_version_id;

    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Linking & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentVersionId && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Current Version</p>
                            <p className="font-sans text-sm text-[#667085]">{currentVersionId || 'Not set'}</p>
                        </div>
                    )}
                    {createdBy && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Created By</p>
                            <p className="font-sans text-sm text-[#667085]">{createdBy || 'System'}</p>
                        </div>
                    )}
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Created Date</p>
                        <p className="font-sans text-sm text-[#667085]">{createdDate ? formatDate(createdDate) : '-'}</p>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Updated Date</p>
                        <p className="font-sans text-sm text-[#667085]">{updatedDate ? formatDate(updatedDate) : '-'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MetadataModelDetails
