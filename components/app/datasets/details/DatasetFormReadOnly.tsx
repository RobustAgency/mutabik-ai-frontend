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

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Dataset Name" value={dataset.name} />
                    <ReadOnlyField label="Purpose" value={dataset.purpose} />
                    <ReadOnlyField label="Owner Team" value={dataset.owner_team} />
                </div>
                {dataset.schema_summary && (
                    <ReadOnlyField label="Schema Summary" value={dataset.schema_summary} />
                )}
            </div>

            {/* Privacy Posture */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Privacy Posture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Sensitivity" value={dataset.sensitivity} />
                    <ReadOnlyField label="Contains PII" value={dataset.contains_pii} />
                    <ReadOnlyField label="Controller Role" value={dataset.controller_role} />
                </div>

                {dataset.data_subject_categories && dataset.data_subject_categories.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-[#667085]">Data Subject Categories</Label>
                        <div className="flex flex-wrap gap-2">
                            {dataset.data_subject_categories.map((cat, index) => (
                                <Badge key={index} variant="light">{cat}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lawful Basis */}
            {dataset.contains_pii === "Yes" && dataset.lawful_basis && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Lawful Basis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReadOnlyField label="Lawful Basis" value={dataset.lawful_basis} />
                        {dataset.lawful_basis_detail && (
                            <ReadOnlyField label="Lawful Basis Detail" value={dataset.lawful_basis_detail} />
                        )}
                        {dataset.lawful_basis === "Consent" && (
                            <>
                                <ReadOnlyField label="Consent Coverage %" value={dataset.consent_coverage_pct} />
                                <ReadOnlyField label="Consent Source Reference" value={dataset.consent_source_ref} />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Licensing */}
            {(dataset.licensing_basis || dataset.license_type) && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Licensing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dataset.licensing_basis && <ReadOnlyField label="Licensing Basis" value={dataset.licensing_basis} />}
                        {dataset.license_type && <ReadOnlyField label="License Type" value={dataset.license_type} />}
                    </div>
                </div>
            )}

            {/* Data Characteristics */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Characteristics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadOnlyField label="Data Structure" value={dataset.data_structure} />
                    <ReadOnlyField label="Storage Format" value={dataset.storage_format} />
                    <ReadOnlyField label="Cross-Border Transfer" value={dataset.cross_border_transfer} />
                </div>
            </div>

            {/* Additional References */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Additional References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataset.privacy_notice_ref && <ReadOnlyField label="Privacy Notice Reference" value={dataset.privacy_notice_ref} />}
                    {dataset.retention_policy_ref && <ReadOnlyField label="Retention Policy Reference" value={dataset.retention_policy_ref} />}
                    {dataset.dpia_ref && <ReadOnlyField label="DPIA Reference" value={dataset.dpia_ref} />}
                    {dataset.aia_ref && <ReadOnlyField label="AIA Reference" value={dataset.aia_ref} />}
                    {dataset.refresh_cadence && <ReadOnlyField label="Refresh Cadence" value={dataset.refresh_cadence} />}
                    {dataset.quality_SLA && <ReadOnlyField label="Quality SLA" value={dataset.quality_SLA} />}
                    {dataset.catalog_asset_id && <ReadOnlyField label="Catalog Asset ID" value={dataset.catalog_asset_id} />}
                    {dataset.catalog_uri && <ReadOnlyField label="Catalog URI" value={dataset.catalog_uri} />}
                </div>
            </div>

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

