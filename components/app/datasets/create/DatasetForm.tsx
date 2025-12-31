"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CreateDatasetData, Purpose, OwnerTeam } from "@/app/lib/features/datasetsApi";
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
    const { data: dataSourcesData, isLoading: isDataSourcesLoading } = useGetDataSourcesQuery({});
    const dataSources = dataSourcesData?.data || [];

    const handleInputChange = (field: keyof CreateDatasetData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleArrayAdd = (field: "source_ids", value: string) => {
        if (field === "source_ids") {
            // Convert to integer for source_ids
            const intValue = parseInt(value, 10);
            if (!isNaN(intValue) && !formData.source_ids.includes(intValue)) {
                setFormData((prev) => ({
                    ...prev,
                    source_ids: [...prev.source_ids, intValue],
                }));
            }
        }
    };

    const handleArrayRemove = (field: "source_ids", valueToRemove: string | number) => {
        if (field === "source_ids") {
            const intValue = typeof valueToRemove === 'string' ? parseInt(valueToRemove, 10) : valueToRemove;
            setFormData((prev) => ({
                ...prev,
                source_ids: prev.source_ids.filter((id) => id !== intValue),
            }));
        }
    };

    // Note: lawful_basis and consent-related fields removed from API


    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Dataset Name <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="purpose">Purpose <span className="text-red-500">*</span></Label>
                        <Select
                            key={`purpose-${formData.purpose || 'empty'}`}
                            value={formData.purpose || ""}
                            onValueChange={(value) => handleInputChange("purpose", value as Purpose)}
                        >
                            <SelectTrigger className={errors.purpose ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Purpose.AI_ML_TRAINING}>AI/ML Training</SelectItem>
                                <SelectItem value={Purpose.AI_ML_FINE_TUNING}>AI/ML Fine-Tuning</SelectItem>
                                <SelectItem value={Purpose.AI_ML_RETRIEVAL}>AI/ML Retrieval</SelectItem>
                                <SelectItem value={Purpose.AI_ML_EVALUATION}>AI/ML Evaluation</SelectItem>
                                <SelectItem value={Purpose.ANALYTIC_BUSINESS_INTELLIGENCE}>Analytic/Business Intelligence</SelectItem>
                                <SelectItem value={Purpose.OPERATIONAL_TRANSFORMATION}>Operational/Transformation</SelectItem>
                                <SelectItem value={Purpose.MASTER_DATA}>Master Data</SelectItem>
                                <SelectItem value={Purpose.REFERENCE_DATA}>Reference Data</SelectItem>
                                <SelectItem value={Purpose.REPORTING}>Reporting</SelectItem>
                                <SelectItem value={Purpose.COMPLIANCE_AUDIT}>Compliance/Audit</SelectItem>
                                <SelectItem value={Purpose.ARCHIVAL_HISTORICAL}>Archival/Historical</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.purpose && (
                            <p className="text-sm text-destructive">{errors.purpose[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="owner_team">Owner Team <span className="text-red-500">*</span></Label>
                        <Select
                            key={`owner_team-${formData.owner_team || 'empty'}`}
                            value={formData.owner_team || ""}
                            onValueChange={(value) => handleInputChange("owner_team", value as OwnerTeam)}
                        >
                            <SelectTrigger className={errors.owner_team ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select owner team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={OwnerTeam.DATA_ENGINEERING_TEAM}>Data Engineering Team</SelectItem>
                                <SelectItem value={OwnerTeam.ML_PLATFORM_TEAM}>ML Platform Team</SelectItem>
                                <SelectItem value={OwnerTeam.PRIVACY_OFFICE}>Privacy Office</SelectItem>
                                <SelectItem value={OwnerTeam.AI_GOVERNANCE_BOARD}>AI Governance Board</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.owner_team && (
                            <p className="text-sm text-destructive">{errors.owner_team[0]}</p>
                        )}
                    </div>
                </div>

                {/* Schema Summary - Removed from API */}
            </div>

            {/* Data Sources */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Sources <span className="text-red-500">*</span></h3>
                <div className="space-y-2">
                    <Label htmlFor="source_ids_picker">Select data source</Label>
                    <SelectWithInlineCreate
                        value=""
                        onValueChange={(value) => handleArrayAdd("source_ids", value)}
                        options={dataSources.map((source) => ({
                            id: source.id,
                            label: source.name,
                            value: String(source.id),
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
                            const source = dataSources.find((s) => String(s.id) === String(sourceId));
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
                        <Label htmlFor="sensitivity">Sensitivity <span className="text-red-500">*</span></Label>
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

                    {/* Contains PII - Now uses contains_personal_data enum */}
                    {/* Controller Role - Removed from API */}
                </div>

                {/* Data Subject Categories - Removed from API */}
                {/* These fields are no longer part of the CreateDatasetData interface */}
            </div>

            {/* Lawful Basis - Removed from API */}
            {/* These fields are no longer part of the CreateDatasetData interface */}

            {/* Licensing */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Licensing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Licensing Basis - Removed from API */}
                    <div className="space-y-2 w-full">
                        <Label htmlFor="license_type">License Type</Label>
                        <Select
                            key={`license_type-${formData.license_type || 'empty'}`}
                            value={formData.license_type || ""}
                            onValueChange={(value) => handleInputChange("license_type", value)}
                        >
                            <SelectTrigger className={errors.license_type ? "border-destructive w-full" : "w-full"}>
                                <SelectValue placeholder="Select license type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="proprietary">Proprietary</SelectItem>
                                <SelectItem value="open_source">Open Source</SelectItem>
                                <SelectItem value="purchased">Purchased</SelectItem>
                                <SelectItem value="commercial_license">Commercial License</SelectItem>
                                <SelectItem value="research_use_only">Research Use Only</SelectItem>
                                <SelectItem value="no_restrictions">No Restrictions</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.license_type && (
                            <p className="text-sm text-destructive">{errors.license_type[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Data Characteristics - Removed from API */}
            {/* data_structure, storage_format, and Additional References fields are no longer part of the CreateDatasetData interface */}
        </div>
    );
};

export default DatasetForm;

