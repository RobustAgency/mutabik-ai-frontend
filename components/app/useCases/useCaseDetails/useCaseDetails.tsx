"use client";

import React from "react";
import { useGetUseCaseQuery } from "@/app/lib/features/useCasesApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import {
    TrendingUp,
    DollarSign,
    Clock,
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Mail,
    FileText
} from "lucide-react";

interface UseCaseDetailsProps {
    useCaseId: string;
}

// Helper component for detail items
const DetailItem: React.FC<{ label: string; value: string | number | null | undefined }> = ({
    label,
    value
}) => (
    <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
        <p className="font-sans font-normal text-sm leading-5 text-[#667085]">{label}</p>
        <p className="font-sans font-semibold text-base leading-6 text-[#344054]">
            {value !== null && value !== undefined ? String(value) : "N/A"}
        </p>
    </div>
);

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusColors: Record<string, string> = {
        draft: "bg-gray-100 text-gray-800",
        under_review: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        in_development: "bg-blue-100 text-blue-800",
        testing: "bg-purple-100 text-purple-800",
        staging: "bg-indigo-100 text-indigo-800",
        active: "bg-green-100 text-green-800",
        suspended: "bg-red-100 text-red-800",
        deprecated: "bg-gray-100 text-gray-800",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"
            }`}>
            {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </span>
    );
};

// Risk level badge
const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
    const riskColors: Record<string, string> = {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-100 text-red-800",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColors[level] || "bg-gray-100 text-gray-800"
            }`}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
        </span>
    );
};

// Format currency
const formatCurrency = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numValue);
};

// Format number with commas
const formatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return new Intl.NumberFormat("en-US").format(numValue);
};

const UseCaseDetails: React.FC<UseCaseDetailsProps> = ({ useCaseId }) => {
    const { data: useCase, isLoading, error } = useGetUseCaseQuery(
        parseInt(useCaseId)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading use case details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const errorMsg = (error as any)?.error?.data?.message ||
            (error as any)?.data?.message ||
            "Failed to load use case";

        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center text-red-600">
                    <p className="text-lg font-semibold">Error loading use case</p>
                    <p className="mt-2">{errorMsg}</p>
                </div>
            </div>
        );
    }

    if (!useCase) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center text-gray-600">
                    <p className="text-lg">Use case not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1D2939]">{useCase.name || useCase.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={useCase.status} />
                        <RiskBadge level={useCase.risk_level} />
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-4 justify-between">
                            <DetailItem label="ID" value={useCase.id} />
                            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                                <p className="font-sans font-normal text-sm leading-5 text-[#667085]">Status</p>
                                <StatusBadge status={useCase.status} />
                            </div>
                            <DetailItem label="Business Domain" value={useCase.business_domain} />
                            {useCase.use_case_type && <DetailItem label="Use Case Type" value={useCase.use_case_type} />}
                            {useCase.value_driver && <DetailItem label="Value Driver" value={useCase.value_driver} />}
                            <DetailItem
                                label="Created"
                                value={useCase.created_at ? formatDate(useCase.created_at) : null}
                            />
                        </div>
                        {useCase.description && (
                            <div className="mt-4 pt-4 border-t border-[#E4E7EC]">
                                <p className="font-sans font-normal text-sm text-[#667085] mb-2">Description</p>
                                <p className="font-sans font-normal text-base text-[#344054]">{useCase.description}</p>
                            </div>
                        )}
                        {useCase.business_objective && (
                            <div className="pt-4 border-t border-[#E4E7EC]">
                                <p className="font-sans font-normal text-sm text-[#667085] mb-2">Business Objective</p>
                                <p className="font-sans font-normal text-base text-[#344054]">{useCase.business_objective}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Business & Ownership */}
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Ownership & Contacts
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-4 justify-between">
                        <DetailItem
                            label="Business Owner Email"
                            value={useCase.business_owner?.email || useCase.business_owner_email}
                        />
                        <DetailItem
                            label="Technical Owner Email"
                            value={useCase.technical_owner?.email || useCase.technical_owner_email}
                        />
                        <DetailItem label="Data Sensitivity" value={useCase.data_sensitivity} />
                        <DetailItem
                            label="Target Go Live Date"
                            value={useCase.target_go_live_date ? formatDate(useCase.target_go_live_date) : (useCase.go_live_date ? formatDate(useCase.go_live_date) : null)}
                        />
                    </div>
                    {useCase.regulatory_scope && useCase.regulatory_scope.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#E4E7EC]">
                            <p className="font-sans font-normal text-sm text-[#667085] mb-3">Regulatory Scope</p>
                            <div className="flex flex-wrap gap-2">
                                {useCase.regulatory_scope.map((scope, index) => (
                                    <Badge key={index} variant="outlined" className="px-3 py-1">
                                        {scope}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Financial Metrics */}
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Financial Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#667085]">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">Expected ROI</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#344054]">
                                {useCase.expected_roi_percentage !== null && useCase.expected_roi_percentage !== undefined
                                    ? `${parseFloat(String(useCase.expected_roi_percentage))}%`
                                    : (useCase.expected_roi !== null && useCase.expected_roi !== undefined
                                        ? `${useCase.expected_roi}%`
                                        : "N/A")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#667085]">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">Implementation Cost</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#344054]">
                                {formatCurrency(useCase.estimated_implementation_cost || useCase.implementation_cost)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#667085]">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">Increase in Revenue</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#344054]">
                                {formatCurrency(useCase.estimated_revenue_increase || useCase.increase_revenue)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#667085]">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Reduction in Time (hrs)</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#344054]">
                                {formatNumber(useCase.estimated_reduction_in_time || useCase.reduction_time)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#667085]">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">Reduction in Cost</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#344054]">
                                {formatCurrency(useCase.estimated_reduction_in_cost || useCase.reduction_cost)}
                            </p>
                        </div>
                        {useCase.risk_avoidance && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#667085]">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm">Risk Avoidance</span>
                                </div>
                                <p className="text-2xl font-semibold text-[#344054]">
                                    {formatCurrency(useCase.risk_avoidance)}
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#667085]">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">FTE Capacity Saved</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#344054]">
                                {formatNumber(useCase.estimated_fte_capacity_saving || useCase.fte_capacity)} FTE
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Risk & Governance */}
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risk & Governance
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-4 justify-between">
                        <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                            <p className="font-sans font-normal text-sm leading-5 text-[#667085]">Risk Level</p>
                            <RiskBadge level={useCase.risk_level} />
                        </div>
                        {useCase.overall_risk_score && (
                            <DetailItem
                                label="Overall Risk Score"
                                value={formatNumber(useCase.overall_risk_score)}
                            />
                        )}
                        {useCase.human_oversigh_mode && (
                            <DetailItem label="Human Oversight Mode" value={useCase.human_oversigh_mode} />
                        )}
                    </div>
                    {(useCase.dpia !== undefined || useCase.aia !== undefined) && (
                        <div className="mt-4 pt-4 border-t border-[#E4E7EC]">
                            <div className="flex flex-wrap gap-6">
                                {useCase.dpia !== undefined && (
                                    <div className="flex items-center gap-2">
                                        {useCase.dpia ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="text-sm font-medium text-[#344054]">
                                            DPIA Required: {useCase.dpia ? "Yes" : "No"}
                                        </span>
                                    </div>
                                )}
                                {useCase.aia !== undefined && (
                                    <div className="flex items-center gap-2">
                                        {useCase.aia ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="text-sm font-medium text-[#344054]">
                                            AIA Required: {useCase.aia ? "Yes" : "No"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Data Assessment */}
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
                <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Data Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-4 justify-between">
                        <DetailItem label="Data Availability Status" value={useCase.data_availability_status} />
                        <DetailItem label="Data Readiness Level" value={useCase.data_readiness || useCase.data_readiness_level} />
                        {useCase.data_freshness && (
                            <DetailItem label="Data Freshness" value={useCase.data_freshness} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UseCaseDetails;
