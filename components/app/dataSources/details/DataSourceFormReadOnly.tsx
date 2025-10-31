"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DataSource } from "@/app/lib/features/dataSourcesApi";

interface DataSourceFormReadOnlyProps {
    dataSource: DataSource;
}

const DataSourceFormReadOnly: React.FC<DataSourceFormReadOnlyProps> = ({
    dataSource,
}) => {
    const ReadOnlyField: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => (
        <div className="space-y-2">
            <Label className="text-[#667085]">{label}</Label>
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                {value || "—"}
            </div>
        </div>
    );

    const DATA_DOMAIN_OPTIONS = [
        { value: "customer_data", label: "Customer Data" },
        { value: "product_data", label: "Product Data" },
        { value: "financial_data", label: "Financial Data" },
        { value: "operational_data", label: "Operational Data" },
        { value: "hr_data", label: "HR Data" },
        { value: "analytics_data", label: "Analytics Data" },
    ];

    const getDataDomainLabel = (value: string): string => {
        const found = DATA_DOMAIN_OPTIONS.find((opt) => opt.value === value);
        return found ? found.label : value;
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Name" value={dataSource.name} />
                    <ReadOnlyField label="System Type" value={dataSource.system_type} />
                    <ReadOnlyField label="Owner Team" value={dataSource.owner_team} />
                    <ReadOnlyField label="Access Method" value={dataSource.access_method} />
                </div>
            </div>

            {/* Data Domains */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Domains</h3>
                {dataSource.data_domains && dataSource.data_domains.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {dataSource.data_domains.map((domain, index) => (
                            <Badge key={index} variant="light">
                                {getDataDomainLabel(domain)}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No data domains specified</p>
                )}
            </div>

            {/* Residency & Classification */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Residency & Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Residency" value={dataSource.residency} />
                    <ReadOnlyField label="Classification" value={dataSource.classification} />
                </div>
            </div>

            {/* Hosting Details */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Hosting Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Hosting Model" value={dataSource.hosting_model} />
                    <ReadOnlyField label="Service Model" value={dataSource.service_model} />
                    <ReadOnlyField label="Cloud Provider" value={dataSource.cloud_provider} />
                    <ReadOnlyField label="Primary Region" value={dataSource.primary_region} />
                    <ReadOnlyField label="Secondary Region" value={dataSource.secondary_region} />
                </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Additional Information</h3>
                <div className="space-y-4">
                    <ReadOnlyField label="Network Reference" value={dataSource.network_ref} />
                    <ReadOnlyField label="Retention Policy Reference" value={dataSource.retention_policy_ref} />
                    <ReadOnlyField label="Catalog URI" value={dataSource.catalog_uri} />
                </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField
                        label="Created At"
                        value={new Date(dataSource.created_at).toLocaleString()}
                    />
                    <ReadOnlyField
                        label="Updated At"
                        value={new Date(dataSource.updated_at).toLocaleString()}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataSourceFormReadOnly;

