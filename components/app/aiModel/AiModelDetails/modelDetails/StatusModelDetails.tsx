import React from 'react'
import { formatValue } from '../AiModelDetails';
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getRiskBadge, getStatusBadge } from '@/lib/helpers/ui';
import { AiModel } from '@/service/app/aiModels';

interface StatusModelDetailsProps {
    aiModel: AiModel;
}

const StatusModelDetails: React.FC<StatusModelDetailsProps> = ({
    aiModel
}) => {
    // Backward compatibility: support both new and old field names
    const businessAdoptionStatus = (aiModel as any).business_adoption_status || (aiModel as any).business_status;
    const regulatoryRiskTier = (aiModel as any).regulatory_risk_tier || (aiModel as any).regulatory_risk_classification || (aiModel as any).regulatory_classification;
    const responsibleOrgRole = (aiModel as any).responsible_org_role || (aiModel as any).organizational_role;
    const criticalityLevel = (aiModel as any).criticality_level;
    const euAiCategory = (aiModel as any).eu_ai_category;

    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Status & Classification</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Business Adoption Status</p>
                        <span className={getStatusBadge(businessAdoptionStatus ?? '', 'business')}>
                            {formatValue(businessAdoptionStatus)}
                        </span>
                    </div>
                    {criticalityLevel && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Criticality Level</p>
                            <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                                {formatValue(criticalityLevel)}
                            </Badge>
                        </div>
                    )}
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Regulatory Risk Tier</p>
                        <span className={getRiskBadge(regulatoryRiskTier || '')}>
                            {formatValue(regulatoryRiskTier || null)}
                        </span>
                    </div>
                    {euAiCategory && (
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">EU AI Category</p>
                            <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                                {formatValue(euAiCategory)}
                            </Badge>
                        </div>
                    )}
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Responsible Organization Role</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(responsibleOrgRole)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatusModelDetails
