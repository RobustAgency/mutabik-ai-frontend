"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dataset } from "@/app/lib/features/datasetsApi";

interface DatasetFormReadOnlyProps {
    dataset: Dataset;
}

const DatasetFormReadOnly: React.FC<DatasetFormReadOnlyProps> = ({ dataset }) => {
    const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
        <div className="space-y-2">
            <Label className="text-[#667085]">{label}</Label>
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                {value !== null && value !== undefined ? value : "—"}
            </div>
        </div>
    );

    const formatEnumValue = (value: string | undefined | null): string => {
        if (!value) return "—";
        return value.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataset.display_id && <ReadOnlyField label="Display ID" value={dataset.display_id} />}
                    <ReadOnlyField label="Dataset Name" value={dataset.name} />
                    {dataset.description && <ReadOnlyField label="Description" value={dataset.description} />}
                    <ReadOnlyField label="Purpose" value={formatEnumValue(dataset.purpose)} />
                    <ReadOnlyField label="Owner Team" value={formatEnumValue(dataset.owner_team)} />
                    <ReadOnlyField label="Data Steward" value={formatEnumValue(dataset.data_steward)} />
                    <ReadOnlyField label="Status" value={formatEnumValue(dataset.status)} />
                </div>
            </div>

            {/* Dataset Metrics */}
            {(dataset.estimated_row_count || dataset.estimated_size || dataset.retention_period || dataset.primary_languages) && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Dataset Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dataset.estimated_row_count !== null && dataset.estimated_row_count !== undefined && (
                            <ReadOnlyField label="Estimated Row Count" value={dataset.estimated_row_count.toLocaleString()} />
                        )}
                        {dataset.estimated_size !== null && dataset.estimated_size !== undefined && (
                            <ReadOnlyField 
                                label="Estimated Size" 
                                value={`${dataset.estimated_size.toLocaleString()} ${dataset.size_unit || ''}`} 
                            />
                        )}
                        {dataset.retention_period && (
                            <ReadOnlyField label="Retention Period" value={dataset.retention_period} />
                        )}
                        {dataset.primary_languages && dataset.primary_languages.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-[#667085]">Primary Languages</Label>
                                <div className="flex flex-wrap gap-2">
                                    {dataset.primary_languages.map((lang, index) => (
                                        <Badge key={index} variant="light">{formatEnumValue(lang)}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Privacy Posture */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Privacy Posture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Sensitivity" value={formatEnumValue(dataset.sensitivity)} />
                    <ReadOnlyField label="Contains Personal Data" value={formatEnumValue(dataset.contains_personal_data)} />
                </div>
            </div>

            {/* Cross-Border & Licensing */}
            {(dataset.cross_border_transfer || dataset.license_type) && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Cross-Border & Licensing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReadOnlyField label="Cross-Border Transfer" value={formatEnumValue(dataset.cross_border_transfer)} />
                        {dataset.license_type && (
                            <ReadOnlyField label="License Type" value={formatEnumValue(dataset.license_type)} />
                        )}
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Created At" value={new Date(dataset.created_at).toLocaleString()} />
                    <ReadOnlyField label="Updated At" value={new Date(dataset.updated_at).toLocaleString()} />
                </div>
            </div>
        </div>
    );
};

export default DatasetFormReadOnly;
