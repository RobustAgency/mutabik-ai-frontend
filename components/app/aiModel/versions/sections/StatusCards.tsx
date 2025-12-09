"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Settings, Package } from "lucide-react";

interface StatusCardsProps {
    deploymentStatus: string;
    lifecycleStage: string;
    versionType: string;
}

const StatusCards: React.FC<StatusCardsProps> = ({
    deploymentStatus,
    lifecycleStage,
    versionType
}) => {
    const getStatusBadge = (status: string, type: 'deployment' | 'lifecycle' | 'version') => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        
        if (type === 'deployment') {
            switch (status) {
                case 'deployed':
                    return `${baseClasses} bg-green-100 text-green-800`;
                case 'deploying':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'failed':
                    return `${baseClasses} bg-red-100 text-red-800`;
                case 'rollback':
                    return `${baseClasses} bg-amber-100 text-amber-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        }
        
        if (type === 'lifecycle') {
            switch (status) {
                case 'production':
                    return `${baseClasses} bg-green-100 text-green-800`;
                case 'staging':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'testing':
                    return `${baseClasses} bg-amber-100 text-amber-800`;
                case 'deprecated':
                    return `${baseClasses} bg-red-100 text-red-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        }
        
        if (type === 'version') {
            switch (status) {
                case 'major':
                    return `${baseClasses} bg-purple-100 text-purple-800`;
                case 'minor':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'patch':
                    return `${baseClasses} bg-gray-100 text-gray-800`;
                case 'experimental':
                    return `${baseClasses} bg-orange-100 text-orange-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        }
        
        return `${baseClasses} bg-gray-100 text-gray-800`;
    };

    const formatCategory = (value: string): string => {
        if (!value || value.length === 0) return "-";
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Activity className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Deployment Status</p>
                            <Badge className={getStatusBadge(deploymentStatus, 'deployment')}>
                                {formatCategory(deploymentStatus)}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Settings className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Lifecycle Stage</p>
                            <Badge className={getStatusBadge(lifecycleStage, 'lifecycle')}>
                                {formatCategory(lifecycleStage)}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Package className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Version Type</p>
                            <Badge className={getStatusBadge(versionType, 'version')}>
                                {formatCategory(versionType)}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatusCards;
