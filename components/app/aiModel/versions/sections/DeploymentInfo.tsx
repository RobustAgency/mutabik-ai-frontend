"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeploymentInfoProps {
    deploymentStatus: string;
    lifecycleStage: string;
    deploymentEnvironments: string[];
    releaseDate?: string;
    hasPerformanceData: boolean;
    performanceBaselineEstablished: boolean;
    complianceStatus?: string;
}

const DeploymentInfo: React.FC<DeploymentInfoProps> = ({
    deploymentStatus,
    lifecycleStage,
    deploymentEnvironments,
    releaseDate,
    hasPerformanceData,
    performanceBaselineEstablished,
    complianceStatus
}) => {
    const getStatusBadge = (status: string, type: 'deployment' | 'lifecycle') => {
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

        return `${baseClasses} bg-gray-100 text-gray-800`;
    };

    const formatCategory = (value: string | undefined): string => {
        if (!value || value.length === 0) return "-";
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Deployment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Deployment Status</p>
                        <Badge className={getStatusBadge(deploymentStatus, 'deployment')}>
                            {formatCategory(deploymentStatus)}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Lifecycle Stage</p>
                        <Badge className={getStatusBadge(lifecycleStage, 'lifecycle')}>
                            {formatCategory(lifecycleStage)}
                        </Badge>
                    </div>
                </div>

                {deploymentEnvironments.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-500">Deployment Environments</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {deploymentEnvironments.map((env, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {formatCategory(env)}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {releaseDate && (
                    <div>
                        <p className="text-sm font-medium text-gray-500">Release Date</p>
                        <p className="text-gray-900">{formatDate(releaseDate)}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${hasPerformanceData ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                        <span className="text-sm text-gray-700">Has Performance Data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${performanceBaselineEstablished ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                        <span className="text-sm text-gray-700">Performance Baseline Established</span>
                    </div>
                </div>

                {complianceStatus && (
                    <div>
                        <p className="text-sm font-medium text-gray-500">Compliance Status</p>
                        <Badge variant="outline">
                            {formatCategory(complianceStatus)}
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DeploymentInfo;
