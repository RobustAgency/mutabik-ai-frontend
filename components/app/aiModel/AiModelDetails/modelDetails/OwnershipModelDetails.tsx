import React from 'react'
import { formatValue } from '../AiModelDetails';
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AiModel } from '@/service/app/aiModels';

interface OwnershipModelDetailsProps {
    aiModel: AiModel;
}

const OwnershipModelDetails: React.FC<OwnershipModelDetailsProps> = ({ aiModel }) => {
    // Backward compatibility: support both new and old field names
    const ownershipCategory = (aiModel as any).ownership_category || (aiModel as any).ownership_type;
    const businessOwnerId = (aiModel as any).business_owner_id;
    const stewardCustodianId = (aiModel as any).steward_custodian_id;
    const modelOwner = (aiModel as any).model_owner;
    const currentOwner = (aiModel as any).current_owner;

    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Ownership & Responsibility</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Ownership Category</p>
                        <Badge variant="light" className="bg-gray-100 text-gray-800 font-sans text-xs">
                            {formatValue(ownershipCategory)}
                        </Badge>
                    </div>
                    {businessOwnerId && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Business Owner</p>
                            <p className="font-sans text-sm text-[#667085]">
                                {businessOwnerId || "Not specified"}
                            </p>
                        </div>
                    )}
                    {stewardCustodianId && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Steward / Custodian</p>
                            <p className="font-sans text-sm text-[#667085]">
                                {stewardCustodianId || "Not specified"}
                            </p>
                        </div>
                    )}
                    {(modelOwner || currentOwner) && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Model Owner</p>
                            <p className="font-sans text-sm text-[#667085]">
                                {modelOwner || currentOwner || "Not specified"}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default OwnershipModelDetails
