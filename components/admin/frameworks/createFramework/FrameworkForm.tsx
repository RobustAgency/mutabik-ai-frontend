"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Description from "@/components/custom/Description";
import FrameworkStatus from "./FrameworkStatus";
import AdditionalInformation from "./AdditionalInformation";
import { useFrameworkMutations } from "@/hooks/admin/useFrameworks";
import { convertFrameworkArraysToStrings, convertFrameworkStringsToArrays } from "@/utils/frameworkUtils";
import {
    Framework,
    FrameworkCategory,
    FrameworkType,
    AuthorityPublisher,
    BindingLevel,
    SectorApplicability,
    RiskClassCoverage,
    CertificationAttestation,
    AssessmentMode,
    CreateFrameworkRequest,
    UpdateFrameworkRequest
} from "@/interfaces/Framework";
import Breadcrumbs from "@/components/custom/Breadcrumbs";

interface FrameworkFormProps {
    framework?: Framework | null;
    isEditing?: boolean;
    onCancel?: () => void;
}

export default function FrameworkForm({ framework, isEditing = false, onCancel }: FrameworkFormProps) {
    const breadcrumbItems = [
        { label: 'Frameworks', href: '/admin/frameworks' },
        { label: isEditing ? 'Edit' : 'Create' },
    ];

    // Basic form state
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        type: FrameworkType.LAW_ACT,
        geography: "",
        category: FrameworkCategory.Mandatory,
        version: "",
    });

    // Additional information state - will be managed by AdditionalInformation component
    const [additionalInfo, setAdditionalInfo] = useState({
        authority_publisher: undefined as AuthorityPublisher | undefined,
        binding_level: undefined as BindingLevel | undefined,
        sector_applicability: [] as SectorApplicability[],
        risk_class_coverage: [] as RiskClassCoverage[],
        certification_attestation: [] as CertificationAttestation[],
        assessment_mode: [] as AssessmentMode[],
    });

    // Complex state fields
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<{ releaseDate: string; published: boolean }>({
        releaseDate: new Date().toISOString().split('T')[0],
        published: false,
    });

    // File upload state
    const [preview, setPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const { creating, updating, createFramework, updateFramework } = useFrameworkMutations();

    // Memoized callback functions
    const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleReleaseDateChange = useCallback((date: string) => {
        setStatus(prev => ({ ...prev, releaseDate: date }));
    }, []);

    const handlePublishedChange = useCallback((published: boolean) => {
        setStatus(prev => ({ ...prev, published }));
    }, []);

    // Callback to receive data from AdditionalInformation component
    const handleAdditionalInfoChange = useCallback((data: {
        authority_publisher?: AuthorityPublisher;
        binding_level?: BindingLevel;
        sector_applicability: SectorApplicability[];
        risk_class_coverage: RiskClassCoverage[];
        certification_attestation: CertificationAttestation[];
        assessment_mode: AssessmentMode[];
    }) => {
        setAdditionalInfo({
            authority_publisher: data.authority_publisher,
            binding_level: data.binding_level,
            sector_applicability: data.sector_applicability,
            risk_class_coverage: data.risk_class_coverage,
            certification_attestation: data.certification_attestation,
            assessment_mode: data.assessment_mode,
        });
    }, []);

    // Initialize form with existing framework data
    useEffect(() => {
        if (framework && isEditing) {
            setFormData({
                name: framework.name || "",
                code: framework.code || "",
                type: framework.type || FrameworkType.LAW_ACT,
                geography: framework.geography || "",
                category: framework.category || FrameworkCategory.Mandatory,
                version: framework.version || "",
            });

            setDescription(framework.description || "");
            setStatus({
                releaseDate: framework.release_date ? framework.release_date.split('T')[0] : new Date().toISOString().split('T')[0],
                published: framework.is_published ?? false,
            });

            // Set additional info - will be passed to AdditionalInformation component
            // Convert comma-separated strings from backend to arrays for frontend
            const convertedArrays = convertFrameworkStringsToArrays({
                sector_applicability: framework.sector_applicability,
                risk_class_coverage: framework.risk_class_coverage,
                certification_attestation: framework.certification_attestation,
                assessment_mode: framework.assessment_mode,
            });

            const newAdditionalInfo = {
                authority_publisher: framework.authority_publisher,
                binding_level: framework.binding_level,
                sector_applicability: convertedArrays.sector_applicability,
                risk_class_coverage: convertedArrays.risk_class_coverage,
                certification_attestation: convertedArrays.certification_attestation,
                assessment_mode: convertedArrays.assessment_mode,
            };

            setAdditionalInfo(newAdditionalInfo);

            // Set logo preview if exists
            if (framework.framework_logo_url) {
                setPreview(framework.framework_logo_url);
            }
        }
    }, [framework, isEditing]);

    // File Upload Handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            setLogoFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert arrays to comma-separated strings for the backend
        const convertedAdditionalInfo = convertFrameworkArraysToStrings({
            sector_applicability: additionalInfo.sector_applicability,
            risk_class_coverage: additionalInfo.risk_class_coverage,
            certification_attestation: additionalInfo.certification_attestation,
            assessment_mode: additionalInfo.assessment_mode,
        });

        const requestData = {
            ...formData,
            authority_publisher: additionalInfo.authority_publisher,
            binding_level: additionalInfo.binding_level,
            description,
            release_date: status.releaseDate,
            is_published: status.published ? 1 : 0,
        };

        // Add the converted comma-separated strings to the request data
        // These will be sent as strings to the backend
        const finalRequestData = {
            ...requestData,
            sector_applicability: convertedAdditionalInfo.sector_applicability,
            risk_class_coverage: convertedAdditionalInfo.risk_class_coverage,
            certification_attestation: convertedAdditionalInfo.certification_attestation,
            assessment_mode: convertedAdditionalInfo.assessment_mode,
        } as unknown;

        if (logoFile) {
            (finalRequestData as Record<string, unknown>).framework_logo = logoFile;
        }

        if (isEditing && framework) {
            await updateFramework(framework.id, finalRequestData as UpdateFrameworkRequest);
        } else {
            await createFramework(finalRequestData as CreateFrameworkRequest);
        }

        // Form will be redirected by the hook on success
    };

    // Memoized conversion of array data for AdditionalInformation component
    const memoizedArrayProps = useMemo(() => ({
        initialSectorApplicability: additionalInfo.sector_applicability,
        initialRiskClassCoverage: additionalInfo.risk_class_coverage,
        initialCertificationAttestation: additionalInfo.certification_attestation,
        initialAssessmentMode: additionalInfo.assessment_mode,
    }), [
        additionalInfo.assessment_mode,
        additionalInfo.certification_attestation,
        additionalInfo.risk_class_coverage,
        additionalInfo.sector_applicability
    ]);

    const isLoading = creating || updating;

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-start">
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Heading */}
            <h1 className="text-3xl text-[#171717] font-bold mt-4 mb-6">
                {isEditing ? 'Edit Framework' : 'Create Framework'}
            </h1>

            <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Main Form Card */}
                <Card className="flex-1 border-0 rounded-xl py-0 !bg-transparent">
                    <form className="space-y-6 w-full" onSubmit={handleSubmit}>

                        {/* Basic Information */}
                        <Card className="bg-white p-6">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#171717]">Logo</h3>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            id="logo-upload"
                                        />
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                            {preview ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <Image
                                                        src={preview}
                                                        alt="Framework logo preview"
                                                        width={64}
                                                        height={64}
                                                        className="object-cover rounded-lg"
                                                    />
                                                    <div className="text-sm text-gray-600">
                                                        Drag & Drop your file or <span className="text-green-500 font-medium">Browse</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-600">
                                                    Drag & Drop your file or <span className="text-green-500 font-medium cursor-pointer">Browse</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Name & Code */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-[#171717] text-sm font-medium" htmlFor="name">
                                            Title
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter framework name"
                                            value={formData.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#171717] text-sm font-medium" htmlFor="code">
                                            Code
                                        </Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            placeholder="e.g., EU-AI-ACT"
                                            value={formData.code}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('code', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Geography & Version */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-[#171717] text-sm font-medium" htmlFor="geography">
                                            Geography
                                        </Label>
                                        <Input
                                            id="geography"
                                            type="text"
                                            placeholder="e.g., European Union"
                                            value={formData.geography}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('geography', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#171717] text-sm font-medium" htmlFor="version">
                                            Version
                                        </Label>
                                        <Input
                                            id="version"
                                            type="text"
                                            placeholder="e.g., 1.0"
                                            value={formData.version}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('version', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Type & Category */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-[#171717] text-sm font-medium" htmlFor="type">
                                            Type
                                        </Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => handleInputChange('type', value as FrameworkType)}
                                        >
                                            <SelectTrigger className="mt-1 w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={FrameworkType.LAW_ACT}>Law/Act</SelectItem>
                                                <SelectItem value={FrameworkType.REGULATION}>Regulation</SelectItem>
                                                <SelectItem value={FrameworkType.STANDARD}>Standard</SelectItem>
                                                <SelectItem value={FrameworkType.FRAMEWORK}>Framework</SelectItem>
                                                <SelectItem value={FrameworkType.GUIDELINE}>Guideline</SelectItem>
                                                <SelectItem value={FrameworkType.POLICY_INTERNAL}>Internal Policy</SelectItem>
                                                <SelectItem value={FrameworkType.SUPERVISORY_NOTICE}>Supervisory Circular/Notice</SelectItem>
                                                <SelectItem value={FrameworkType.INDUSTRY_CODE}>Industry Code of Conduct</SelectItem>
                                                <SelectItem value={FrameworkType.CERT_SCHEME}>Certification/Accreditation Scheme</SelectItem>
                                                <SelectItem value={FrameworkType.CONTRACTUAL}>Contractual/Procurement Rule</SelectItem>
                                                <SelectItem value={FrameworkType.OTHER}>Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-[#171717] text-sm font-medium" htmlFor="category">
                                            Category
                                        </Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => handleInputChange('category', value as FrameworkCategory)}
                                        >
                                            <SelectTrigger className="mt-1 w-full">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={FrameworkCategory.Mandatory}>Mandatory</SelectItem>
                                                <SelectItem value={FrameworkCategory.Voluntary}>Voluntary</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Description */}
                                <Description value={description} onChange={(html: string) => setDescription(html)} />
                            </div>
                        </Card>

                        {/* Additional Information */}
                        <AdditionalInformation
                            initialAuthorityPublisher={additionalInfo.authority_publisher}
                            initialBindingLevel={additionalInfo.binding_level}
                            initialSectorApplicability={memoizedArrayProps.initialSectorApplicability}
                            initialRiskClassCoverage={memoizedArrayProps.initialRiskClassCoverage}
                            initialCertificationAttestation={memoizedArrayProps.initialCertificationAttestation}
                            initialAssessmentMode={memoizedArrayProps.initialAssessmentMode}
                            onChange={handleAdditionalInfoChange}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#4FD58F] hover:bg-[#3BAD6B] text-white px-6 py-2 rounded-lg"
                            >
                                {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                            </Button>
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="px-6 py-2 rounded-lg"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Sidebar */}
                <div className="w-full md:w-[400px] flex flex-col gap-6">
                    {/* Status Card */}
                    <FrameworkStatus
                        releaseDate={status.releaseDate}
                        published={status.published}
                        onReleaseDateChange={handleReleaseDateChange}
                        onPublishedChange={handlePublishedChange}
                    />
                </div>
            </div>
        </div>
    );
}
