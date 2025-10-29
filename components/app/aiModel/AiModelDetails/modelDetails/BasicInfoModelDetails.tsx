import React from 'react'
import { formatValue } from '../AiModelDetails';
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface BasicInfoModelDetailsProps {
    aiModel: {
        name: string;
        primary_category: string | null;
        type: string | null;
        domain_specialization: string | null;
        total_versions: number | null;
        strategic_importance?: string | null;  // Changed to optional with ?
        description: string | null;
    };
}

const BasicInfoModelDetails: React.FC<BasicInfoModelDetailsProps> = ({ aiModel }) => {
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
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Primary Category</p>
                        <Badge variant="light" className="bg-gray-100 text-gray-800 font-sans text-xs">
                            {formatValue(aiModel.primary_category)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Type</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(aiModel.type)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Domain Specialization</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(aiModel.domain_specialization)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Total Versions</p>
                        <p className="font-sans text-sm text-[#667085]">{aiModel.total_versions || 0}</p>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Strategic Importance</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(aiModel.strategic_importance || null)}
                        </Badge>
                    </div>
                </div>
                <div>
                    <p className="font-sans font-medium text-xs text-[#667085] mb-2">Description</p>
                    <p className="font-sans text-sm text-[#667085] leading-5">
                        {aiModel.description || "No description provided"}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicInfoModelDetails