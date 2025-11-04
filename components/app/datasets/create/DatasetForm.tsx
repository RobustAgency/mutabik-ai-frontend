"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateDatasetData } from "@/app/lib/features/datasetsApi";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DataSourceModalForm from "@/components/app/dataSources/create/DataSourceModalForm";

interface DatasetFormProps {
    formData: CreateDatasetData;
    setFormData: React.Dispatch<React.SetStateAction<CreateDatasetData>>;
    errors: Record<string, string[]>;
}

const DatasetForm: React.FC<DatasetFormProps> = ({
    formData,
    setFormData,
    errors,
}) => {
    console.log("🚀 ~ DatasetForm ~ formData:", formData)
    const { data: dataSourcesData, isLoading: isDataSourcesLoading } = useGetDataSourcesQuery();
    const dataSources = dataSourcesData || [];

    const handleInputChange = (field: keyof CreateDatasetData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleArrayAdd = (field: "source_ids" | "data_subject_categories" | "content_types", value: string) => {
        // Convert to string and trim (handles numeric IDs from API)
        const stringValue = String(value).trim();
        if (stringValue && !formData[field]?.includes(stringValue)) {
            setFormData((prev) => ({
                ...prev,
                [field]: [...(prev[field] || []), stringValue],
            }));
        }
    };

    const handleArrayRemove = (field: "source_ids" | "data_subject_categories" | "content_types", valueToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field] || []).filter((item) => item !== valueToRemove),
        }));
    };

    // Show consent fields only when lawful_basis is "Consent"
    const showConsentFields = formData.lawful_basis === "Consent";

    // Show lawful basis when contains_pii is "Yes"
    const showLawfulBasis = formData.contains_pii === "Yes";

    console.log(formData.purpose, 'formData.purpose');


    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Dataset Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={errors.name ? "border-destructive" : ""}
                            placeholder="Enter dataset name"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="purpose">Purpose *</Label>
                        <Select
                            key={`purpose-${formData.purpose || 'empty'}`}
                            value={formData.purpose || ""}
                            onValueChange={(value) => handleInputChange("purpose", value)}
                        >
                            <SelectTrigger className={errors.purpose ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="train">Train</SelectItem>
                                <SelectItem value="val">Validation</SelectItem>
                                <SelectItem value="test">Test</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="analytics">Analytics</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.purpose && (
                            <p className="text-sm text-destructive">{errors.purpose[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="owner_team">Owner Team *</Label>
                        <Input
                            id="owner_team"
                            value={formData.owner_team}
                            onChange={(e) => handleInputChange("owner_team", e.target.value)}
                            className={errors.owner_team ? "border-destructive" : ""}
                            placeholder="Enter owner team"
                        />
                        {errors.owner_team && (
                            <p className="text-sm text-destructive">{errors.owner_team[0]}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="schema_summary">Schema Summary</Label>
                    <Textarea
                        id="schema_summary"
                        value={formData.schema_summary || ""}
                        onChange={(e) => handleInputChange("schema_summary", e.target.value)}
                        placeholder="Optional schema description"
                        rows={3}
                    />
                </div>
            </div>

            {/* Data Sources */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Sources *</h3>
                <div className="space-y-2">
                    <Label htmlFor="source_ids_picker">Select data source</Label>
                    <SelectWithInlineCreate
                        value=""
                        onValueChange={(value) => handleArrayAdd("source_ids", value)}
                        options={dataSources.map((source) => ({
                            id: source.id,
                            label: source.name,
                            value: source.id,
                        }))}
                        isLoading={isDataSourcesLoading}
                        isEmpty={!isDataSourcesLoading && dataSources.length === 0}
                        entityName="Data Source"
                        modalForm={DataSourceModalForm}
                        placeholder={isDataSourcesLoading ? "Loading sources..." : "Choose a data source"}
                        error={!!errors.source_ids}
                    />
                    {errors.source_ids && (
                        <p className="text-sm text-destructive">{errors.source_ids[0]}</p>
                    )}
                </div>

                {formData.source_ids && formData.source_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.source_ids.map((sourceId) => {
                            const source = dataSources.find((s) => s.id === sourceId);
                            return (
                                <Badge key={sourceId} variant="light" className="flex items-center gap-1">
                                    {source?.name || sourceId}
                                    <button
                                        type="button"
                                        onClick={() => handleArrayRemove("source_ids", sourceId)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Privacy Posture (AC-02 validation) */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Privacy Posture</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                        <Label htmlFor="sensitivity">Sensitivity *</Label>
                        <Select
                            key={`sensitivity-${formData.sensitivity || 'empty'}`}
                            value={formData.sensitivity || ""}
                            onValueChange={(value) => handleInputChange("sensitivity", value)}
                        >
                            <SelectTrigger className={errors.sensitivity ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select sensitivity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="Internal">Internal</SelectItem>
                                <SelectItem value="Confidential">Confidential</SelectItem>
                                <SelectItem value="Restricted">Restricted</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.sensitivity && (
                            <p className="text-sm text-destructive">{errors.sensitivity[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="contains_pii">Contains PII *</Label>
                        <Select
                            key={`contains_pii-${formData.contains_pii || 'empty'}`}
                            value={formData.contains_pii || ""}
                            onValueChange={(value) => handleInputChange("contains_pii", value)}
                        >
                            <SelectTrigger className={errors.contains_pii ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.contains_pii && (
                            <p className="text-sm text-destructive">{errors.contains_pii[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="controller_role">Controller Role *</Label>
                        <Select
                            key={`controller_role-${formData.controller_role || 'empty'}`}
                            value={formData.controller_role || ""}
                            onValueChange={(value) => handleInputChange("controller_role", value)}
                        >
                            <SelectTrigger className={errors.controller_role ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Controller">Controller</SelectItem>
                                <SelectItem value="Joint Controller">Joint Controller</SelectItem>
                                <SelectItem value="Processor">Processor</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.controller_role && (
                            <p className="text-sm text-destructive">{errors.controller_role[0]}</p>
                        )}
                    </div>
                </div>

                {/* Data Subject Categories */}
                <div className="space-y-2">
                    <Label htmlFor="data_subject_categories_picker">Data Subject Categories *</Label>
                    <Select onValueChange={(value) => handleArrayAdd("data_subject_categories", value)}>
                        <SelectTrigger id="data_subject_categories_picker" className="w-full">
                            <SelectValue placeholder="Choose categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Customers">Customers</SelectItem>
                            <SelectItem value="Prospects">Prospects</SelectItem>
                            <SelectItem value="Employees">Employees</SelectItem>
                            <SelectItem value="Vendors">Vendors</SelectItem>
                            <SelectItem value="Minors">Minors</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.data_subject_categories && (
                        <p className="text-sm text-destructive">{errors.data_subject_categories[0]}</p>
                    )}
                </div>

                {formData.data_subject_categories && formData.data_subject_categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.data_subject_categories.map((cat, index) => (
                            <Badge key={index} variant="light" className="flex items-center gap-1">
                                {cat}
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove("data_subject_categories", cat)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Lawful Basis (Required if PII=Yes, AC-02) */}
            {showLawfulBasis && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Lawful Basis (Required for PII)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="lawful_basis">Lawful Basis *</Label>
                            <Select
                                key={`lawful_basis-${formData.lawful_basis || 'empty'}`}
                                value={formData.lawful_basis || ""}
                                onValueChange={(value) => handleInputChange("lawful_basis", value)}
                            >
                                <SelectTrigger className={errors.lawful_basis ? "border-destructive w-full" : "w-full"}>
                                    <SelectValue placeholder="Select lawful basis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Consent">Consent</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Legal Obligation">Legal Obligation</SelectItem>
                                    <SelectItem value="Legitimate Interests">Legitimate Interests</SelectItem>
                                    <SelectItem value="Public Task">Public Task</SelectItem>
                                    <SelectItem value="Vital Interests">Vital Interests</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.lawful_basis && (
                                <p className="text-sm text-destructive">{errors.lawful_basis[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lawful_basis_detail">Lawful Basis Detail</Label>
                            <Input
                                id="lawful_basis_detail"
                                value={formData.lawful_basis_detail || ""}
                                onChange={(e) => handleInputChange("lawful_basis_detail", e.target.value)}
                                placeholder="Optional detail or link to justification"
                            />
                        </div>
                    </div>

                    {/* Info message about consent_required */}
                    {formData.lawful_basis === "Consent" && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> When Lawful Basis is "Consent", the consent_required flag will be automatically set to true. Please provide consent coverage details below.
                            </p>
                        </div>
                    )}

                    {/* Consent-specific fields (AC-02) */}
                    {showConsentFields && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="consent_coverage_pct">Consent Coverage % *</Label>
                                <Input
                                    id="consent_coverage_pct"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.consent_coverage_pct || ""}
                                    onChange={(e) => handleInputChange("consent_coverage_pct", parseInt(e.target.value) || 0)}
                                    className={errors.consent_coverage_pct ? "border-destructive" : ""}
                                    placeholder="0-100"
                                />
                                {errors.consent_coverage_pct && (
                                    <p className="text-sm text-destructive">{errors.consent_coverage_pct[0]}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="consent_source_ref">Consent Source Reference *</Label>
                                <Input
                                    id="consent_source_ref"
                                    value={formData.consent_source_ref || ""}
                                    onChange={(e) => handleInputChange("consent_source_ref", e.target.value)}
                                    className={errors.consent_source_ref ? "border-destructive" : ""}
                                    placeholder="Link to consent artifacts"
                                />
                                {errors.consent_source_ref && (
                                    <p className="text-sm text-destructive">{errors.consent_source_ref[0]}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Licensing */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Licensing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="licensing_basis">Licensing Basis</Label>
                        <Input
                            id="licensing_basis"
                            value={formData.licensing_basis || ""}
                            onChange={(e) => handleInputChange("licensing_basis", e.target.value)}
                            placeholder="Optional licensing basis"
                        />
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="license_type">License Type</Label>
                        <Select
                            key={`license_type-${formData.license_type || 'empty'}`}
                            value={formData.license_type || ""}
                            onValueChange={(value) => handleInputChange("license_type", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select license type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Proprietary">Proprietary</SelectItem>
                                <SelectItem value="Open (permissive)">Open (permissive)</SelectItem>
                                <SelectItem value="Open (copyleft)">Open (copyleft)</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Dataset EULA">Dataset EULA</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Data Characteristics */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Characteristics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                        <Label htmlFor="data_structure">Data Structure *</Label>
                        <Select
                            key={`data_structure-${formData.data_structure || 'empty'}`}
                            value={formData.data_structure || ""}
                            onValueChange={(value) => handleInputChange("data_structure", value)}
                        >
                            <SelectTrigger className={errors.data_structure ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select structure" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="structured">Structured</SelectItem>
                                <SelectItem value="semi_structured">Semi-Structured</SelectItem>
                                <SelectItem value="unstructured">Unstructured</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.data_structure && (
                            <p className="text-sm text-destructive">{errors.data_structure[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="storage_format">Storage Format *</Label>
                        <Select
                            key={`storage_format-${formData.storage_format || 'empty'}`}
                            value={formData.storage_format || ""}
                            onValueChange={(value) => handleInputChange("storage_format", value)}
                        >
                            <SelectTrigger className={errors.storage_format ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="table">Table</SelectItem>
                                <SelectItem value="columnar_parquet">Columnar (Parquet)</SelectItem>
                                <SelectItem value="avro">Avro</SelectItem>
                                <SelectItem value="jsonl">JSONL</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="doc">Document</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="mixture">Mixture</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.storage_format && (
                            <p className="text-sm text-destructive">{errors.storage_format[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="cross_border_transfer">Cross-Border Transfer *</Label>
                        <Select
                            key={`cross_border_transfer-${formData.cross_border_transfer || 'empty'}`}
                            value={formData.cross_border_transfer || ""}
                            onValueChange={(value) => handleInputChange("cross_border_transfer", value)}
                        >
                            <SelectTrigger className={errors.cross_border_transfer ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select transfer mechanism" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Adequacy">Adequacy</SelectItem>
                                <SelectItem value="SCCs">SCCs</SelectItem>
                                <SelectItem value="DPA Addendum">DPA Addendum</SelectItem>
                                <SelectItem value="Derogation">Derogation</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.cross_border_transfer && (
                            <p className="text-sm text-destructive">{errors.cross_border_transfer[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional References */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Additional References</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="privacy_notice_ref">Privacy Notice Reference</Label>
                        <Input
                            id="privacy_notice_ref"
                            value={formData.privacy_notice_ref || ""}
                            onChange={(e) => handleInputChange("privacy_notice_ref", e.target.value)}
                            placeholder="Optional link to privacy notice"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="retention_policy_ref">Retention Policy Reference</Label>
                        <Input
                            id="retention_policy_ref"
                            value={formData.retention_policy_ref || ""}
                            onChange={(e) => handleInputChange("retention_policy_ref", e.target.value)}
                            placeholder="Optional retention policy link"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dpia_ref">DPIA Reference</Label>
                        <Input
                            id="dpia_ref"
                            value={formData.dpia_ref || ""}
                            onChange={(e) => handleInputChange("dpia_ref", e.target.value)}
                            placeholder="Optional DPIA reference"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="aia_ref">AIA Reference</Label>
                        <Input
                            id="aia_ref"
                            value={formData.aia_ref || ""}
                            onChange={(e) => handleInputChange("aia_ref", e.target.value)}
                            placeholder="Optional AIA reference"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="refresh_cadence">Refresh Cadence</Label>
                        <Input
                            id="refresh_cadence"
                            value={formData.refresh_cadence || ""}
                            onChange={(e) => handleInputChange("refresh_cadence", e.target.value)}
                            placeholder="e.g., Daily, Weekly, Monthly"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quality_SLA">Quality SLA</Label>
                        <Input
                            id="quality_SLA"
                            value={formData.quality_SLA || ""}
                            onChange={(e) => handleInputChange("quality_SLA", e.target.value)}
                            placeholder="Optional quality SLA"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catalog_asset_id">Catalog Asset ID</Label>
                        <Input
                            id="catalog_asset_id"
                            value={formData.catalog_asset_id || ""}
                            onChange={(e) => handleInputChange("catalog_asset_id", e.target.value)}
                            placeholder="Optional catalog ID"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catalog_uri">Catalog URI</Label>
                        <Input
                            id="catalog_uri"
                            value={formData.catalog_uri || ""}
                            onChange={(e) => handleInputChange("catalog_uri", e.target.value)}
                            placeholder="Optional catalog link"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetForm;

