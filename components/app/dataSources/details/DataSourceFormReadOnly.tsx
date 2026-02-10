"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DataSource, DataSourceStatus, OwnerTeam, DataDomain } from "@/app/lib/features/dataSourcesApi";
import { formatDateLongTime } from "@/lib/helpers/date";

interface DataSourceFormReadOnlyProps {
    dataSource: DataSource;
}

const DataSourceFormReadOnly: React.FC<DataSourceFormReadOnlyProps> = ({
    dataSource,
}) => {
    const formatOwnerTeam = (team: OwnerTeam | string | null): string => {
        if (!team) return "N/A";
        return String(team)
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const formatDataDomain = (domain: DataDomain | string): string => {
        return String(domain)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatStatus = (status: DataSourceStatus | null): string => {
        if (!status) return "N/A";
        const statusLabels: Record<DataSourceStatus, string> = {
            [DataSourceStatus.DRAFT]: "Draft",
            [DataSourceStatus.ACTIVE]: "Active",
            [DataSourceStatus.UNDER_REVIEW]: "Under Review",
            [DataSourceStatus.DEPRECATED]: "Deprecated",
            [DataSourceStatus.ARCHIVED]: "Archived",
        };
        return statusLabels[status] || status;
    };

    const getStatusBadgeColor = (status: DataSourceStatus | null): string => {
        if (!status) return "bg-gray-100 text-gray-800";
        const statusColors: Record<DataSourceStatus, string> = {
            [DataSourceStatus.DRAFT]: "bg-gray-100 text-gray-800",
            [DataSourceStatus.ACTIVE]: "bg-green-100 text-green-800",
            [DataSourceStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
            [DataSourceStatus.DEPRECATED]: "bg-orange-100 text-orange-800",
            [DataSourceStatus.ARCHIVED]: "bg-slate-100 text-slate-800",
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "Not specified";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString: string | null | undefined): string => {
        if (!dateString) return "Not specified";
        return formatDateLongTime(dateString);
    };

    const ReadOnlyField: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => (
        <div className="space-y-2">
            <Label className="text-[#667085]">{label}</Label>
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                {value || "—"}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Data Source ID</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {dataSource.display_id || `DS-${String(dataSource.id).padStart(6, "0")}`}
                        </div>
                    </div>
                    <ReadOnlyField label="Name" value={dataSource.name} />
                    <ReadOnlyField label="System Type" value={dataSource.system_type} />
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Status</Label>
                        <div className="p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            <Badge className={getStatusBadgeColor(dataSource.status)}>
                                {formatStatus(dataSource.status)}
                            </Badge>
                        </div>
                    </div>
                    {dataSource.description && (
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[#667085]">Description</Label>
                            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                                {dataSource.description}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Data Domains */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Domains</h3>
                {dataSource.data_domains && dataSource.data_domains.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {dataSource.data_domains.map((domain, index) => (
                            <Badge key={index} variant="outlined">
                                {formatDataDomain(domain)}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No data domains specified</p>
                )}
            </div>

            {/* Location & Classification */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Location & Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Data Residency</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {dataSource.residency?.toUpperCase() || "—"}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Criticality Level</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {dataSource.criticality_level 
                                ? dataSource.criticality_level.charAt(0).toUpperCase() + dataSource.criticality_level.slice(1)
                                : "—"}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Hosting Model</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {dataSource.hosting_model 
                                ? dataSource.hosting_model.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                                : "—"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ownership */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Ownership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Owner Team</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatOwnerTeam(dataSource.owner_team)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Technical Owner</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatOwnerTeam(dataSource.technical_owner)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Business Owner</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatOwnerTeam(dataSource.business_owner)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Dates */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Review Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Last Review Date</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatDate(dataSource.last_review_date)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Next Review Date</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatDate(dataSource.next_review_date)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Created At</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatDateTime(dataSource.created_at)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Updated At</Label>
                        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                            {formatDateTime(dataSource.updated_at)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSourceFormReadOnly;
