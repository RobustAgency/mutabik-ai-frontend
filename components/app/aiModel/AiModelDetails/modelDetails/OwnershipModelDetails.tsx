import React from 'react'
import { formatValue } from '../AiModelDetails';
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface OwnershipModelDetailsProps {
    aiModel: {
        ownership_type: string | null;
        development_source: string | null;
        source_organization: string | null;
        model_owner?: string | null;  // Changed to optional with ?
        vendor_id?: string | null;
    };
}

const OwnershipModelDetails: React.FC<OwnershipModelDetailsProps> = ({ aiModel }) => {
    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Ownership & Governance</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Ownership Type</p>
                        <Badge variant="light" className="bg-gray-100 text-gray-800 font-sans text-xs">
                            {formatValue(aiModel.ownership_type)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Development Source</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(aiModel.development_source)}
                        </Badge>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Source Organization</p>
                        <p className="font-sans text-sm text-[#667085]">
                            {aiModel.source_organization || "Not specified"}
                        </p>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Owner</p>
                        <p className="font-sans text-sm text-[#667085]">
                            {aiModel.model_owner || "Not specified"}
                        </p>
                    </div>
                    {aiModel.vendor_id && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Vendor</p>
                            <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                                {formatValue(aiModel.vendor_id)}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default OwnershipModelDetails