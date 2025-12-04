import React from 'react'
import { formatValue } from '../AiModelDetails';
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AiModel } from '@/service/app/aiModels';

interface BasicInfoModelDetailsProps {
    aiModel: AiModel;
}

const BasicInfoModelDetails: React.FC<BasicInfoModelDetailsProps> = ({ aiModel }) => {
    // Backward compatibility: support both new and old field names
    const modelCategory = (aiModel as any).model_category || (aiModel as any).primary_category;
    const technicalDomain = (aiModel as any).technical_domain || (aiModel as any).domain_specialization;
    const modelPurpose = (aiModel as any).model_purpose || (aiModel as any).description;

    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Name</p>
                        <p className="font-sans font-medium text-sm text-[#1D2939]">{aiModel.name}</p>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Category</p>
                        <Badge variant="light" className="bg-gray-100 text-gray-800 font-sans text-xs">
                            {formatValue(modelCategory)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Type</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(aiModel.type)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Technical Domain</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(technicalDomain)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Total Versions</p>
                        <p className="font-sans text-sm text-[#667085]">{aiModel.total_versions || 0}</p>
                    </div>
                </div>
                {modelPurpose && (
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Purpose / Intended Use</p>
                        <p className="font-sans text-sm text-[#667085] leading-5">
                            {modelPurpose}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default BasicInfoModelDetails
