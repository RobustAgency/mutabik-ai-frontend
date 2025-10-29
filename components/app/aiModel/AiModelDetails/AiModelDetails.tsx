"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAiModelQuery } from "@/app/lib/features/aiModelsApi";
import { ArrowLeft, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface AiModelDetailsProps {
    aiModelId: string;
}

const AiModelDetails: React.FC<AiModelDetailsProps> = ({ aiModelId }) => {
    const router = useRouter();
    const { data: aiModel, isLoading, error } = useGetAiModelQuery(Number(aiModelId));

    const formatValue = (value: string | null): string => {
        if (!value) return "Not provided";
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusBadge = (status: string, type: 'business' | 'operational') => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

        if (type === 'business') {
            switch (status) {
                case 'active':
                    return `${baseClasses} bg-green-100 text-green-800`;
                case 'planned':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'deprecated':
                    return `${baseClasses} bg-gray-100 text-gray-800`;
                case 'retired':
                    return `${baseClasses} bg-red-100 text-red-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        } else {
            switch (status) {
                case 'production':
                    return `${baseClasses} bg-green-100 text-green-800`;
                case 'testing':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'development':
                    return `${baseClasses} bg-yellow-100 text-yellow-800`;
                case 'not_deployed':
                    return `${baseClasses} bg-gray-100 text-gray-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        }
    };

    const getRiskBadge = (classification: string) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

        switch (classification) {
            case 'minimal_risk':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'limited_risk':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'high_risk':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'unacceptable_risk':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'sector_specific':
                return `${baseClasses} bg-purple-100 text-purple-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "Not provided";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Not provided";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="w-full p-6">
                <Card className="rounded-2xl border border-[#E4E7EC]">
                    <CardContent className="p-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !aiModel) {
        return (
            <div className="w-full p-6">
                <Card className="rounded-2xl border border-[#E4E7EC]">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h2 className="font-sans font-semibold text-xl text-[#1D2939] mb-2">AI Model Not Found</h2>
                            <p className="font-sans text-sm text-[#667085] mb-4">
                                The AI model you're looking for doesn't exist or has been removed.
                            </p>
                            <Button
                                onClick={() => router.push("/core-assets/ai-models")}
                                className="bg-[#4FD58F] text-white hover:bg-[#45c180]"
                            >
                                Back to AI Models
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full p-4 sm:p-6 space-y-6">
            {/* Header */}
            <Card className="rounded-2xl border border-[#E4E7EC] bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/core-assets/ai-models")}
                                className="flex items-center gap-2 text-[#667085] hover:text-[#1D2939]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-sans text-sm font-medium">Back</span>
                            </Button>
                            <div>
                                <h1 className="font-sans font-semibold text-xl sm:text-2xl text-[#1D2939]">{aiModel.name}</h1>
                                <p className="font-sans text-xs sm:text-sm text-[#667085] mt-1">AI Model ID: {aiModel.id}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-[#E4E7EC] text-[#667085] hover:bg-gray-50"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="font-sans text-sm">View Versions</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-[#E4E7EC] text-[#667085] hover:bg-gray-50"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="font-sans text-sm">Edit</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-[#E4E7EC] text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="font-sans text-sm">Delete</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="rounded-2xl border border-[#E4E7EC] bg-white">
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
                                {formatValue(aiModel.strategic_importance)}
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

            {/* Status & Classification */}
            <Card className="rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                    <CardTitle className="font-sans font-medium text-sm text-[#000000]">Status & Classification</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Business Status</p>
                            <span className={getStatusBadge(aiModel.business_status, 'business')}>
                                {formatValue(aiModel.business_status)}
                            </span>
                        </div>
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Operational Status</p>
                            <span className={getStatusBadge(aiModel.operational_status, 'operational')}>
                                {formatValue(aiModel.operational_status)}
                            </span>
                        </div>
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Regulatory Classification</p>
                            <span className={getRiskBadge(aiModel.regulatory_classification)}>
                                {formatValue(aiModel.regulatory_classification)}
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

            {/* Ownership & Governance */}
            <Card className="rounded-2xl border border-[#E4E7EC] bg-white">
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

            {/* Metadata */}
            <Card className="rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="px-6 py-4 border-b border-[#E4E7EC]">
                    <CardTitle className="font-sans font-medium text-sm text-[#000000]">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Created</p>
                            <p className="font-sans text-sm text-[#667085]">{formatDate(aiModel.created_at)}</p>
                        </div>
                        <div>
                            <p className="font-sans font-medium text-xs text-[#667085] mb-2">Last Updated</p>
                            <p className="font-sans text-sm text-[#667085]">{formatDate(aiModel.updated_at)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AiModelDetails;