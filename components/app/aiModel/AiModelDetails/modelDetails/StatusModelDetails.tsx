import React from 'react'
import { formatValue } from '../AiModelDetails';
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getRiskBadge, getStatusBadge } from '@/lib/helpers/ui';

interface StatusModelDetailsProps {
    aiModel: {
        business_status: string | null;
        operational_status: string | null;
        regulatory_classification?: string | null;
        organizational_role: string | null;
    };
}

const StatusModelDetails: React.FC<StatusModelDetailsProps> = ({
    aiModel
}) => {
    return (
        <Card className='border-none'>
            <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                <CardTitle className="font-sans font-medium text-sm text-[#000000]">Status & Classification</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Business Status</p>
                        <span className={getStatusBadge(aiModel.business_status ?? '', 'business')}>
                            {formatValue(aiModel.business_status)}
                        </span>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Operational Status</p>
                        <span className={getStatusBadge(aiModel.operational_status ?? '', 'operational')}>
                            {formatValue(aiModel.operational_status)}
                        </span>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Regulatory Classification</p>
                        <span className={getRiskBadge(aiModel.regulatory_classification || '')}>
                            {formatValue(aiModel.regulatory_classification || null)}
                        </span>
                    </div>
                    <div>
                        <p className="font-sans font-medium text-xs text-[#667085] mb-2">Organizational Role</p>
                        <Badge variant="outlined" className="border-[#E4E7EC] text-[#667085] font-sans text-xs">
                            {formatValue(aiModel.organizational_role)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatusModelDetails