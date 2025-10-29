"use client";

import React from "react";
import { useParams } from "next/navigation";
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

    // Helper function to format values for display
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
            month: "long",
            day: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
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
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Model Not Found</h2>
                            <p className="text-gray-600 mb-4">
                                The AI model you're looking for doesn't exist or has been removed.
                            </p>
                            <Button onClick={() => router.push("/core-assets/ai-models")}>
                                Back to AI Models
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/core-assets/ai-models")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{aiModel.name}</h1>
                        <p className="text-sm text-gray-500">AI Model ID: {aiModel.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Versions
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Model Name</p>
                            <p className="text-lg font-semibold text-gray-900">{aiModel.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Primary Category</p>
                            <Badge variant="secondary">{formatValue(aiModel.primary_category)}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Model Type</p>
                            <Badge variant="outline">{formatValue(aiModel.model_type)}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Domain Specialization</p>
                            <Badge variant="outline">{formatValue(aiModel.domain_specialization)}</Badge>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                        <p className="text-gray-700">{aiModel.description || "No description provided"}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Status & Classification */}
            <Card>
                <CardHeader>
                    <CardTitle>Status & Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Business Status</p>
                            <span className={getStatusBadge(aiModel.business_status, 'business')}>
                                {formatValue(aiModel.business_status)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Operational Status</p>
                            <span className={getStatusBadge(aiModel.operational_status, 'operational')}>
                                {formatValue(aiModel.operational_status)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Regulatory Classification</p>
                            <span className={getRiskBadge(aiModel.regulatory_classification)}>
                                {formatValue(aiModel.regulatory_classification)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Organizational Role</p>
                            <Badge variant="outline">{formatValue(aiModel.organizational_role)}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ownership & Governance */}
            <Card>
                <CardHeader>
                    <CardTitle>Ownership & Governance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Ownership Type</p>
                            <Badge variant="secondary">{formatValue(aiModel.ownership_type)}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Development Source</p>
                            <Badge variant="outline">{formatValue(aiModel.development_source)}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Source Organization</p>
                            <p className="text-gray-700">{aiModel.source_organization || "Not specified"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Model Owner</p>
                            <p className="text-gray-700">{aiModel.model_owner || "Not specified"}</p>
                        </div>
                        {aiModel.vendor_id && (
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Vendor</p>
                                <Badge variant="outline">{formatValue(aiModel.vendor_id)}</Badge>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
                <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                            <p className="text-gray-700">{formatDate(aiModel.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                            <p className="text-gray-700">{formatDate(aiModel.updated_at)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AiModelDetails;