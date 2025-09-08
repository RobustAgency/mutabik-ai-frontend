"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomMultiSelect } from "@/components/admin/frameworks/CustomMultiSelect";
import { 
    AuthorityPublisher, 
    BindingLevel, 
    SectorApplicability, 
    RiskClassCoverage, 
    CertificationAttestation, 
    AssessmentMode 
} from "@/interfaces/Framework";

interface AdditionalInformationProps {
    // Initial values (for editing mode)
    initialAuthorityPublisher?: AuthorityPublisher;
    initialBindingLevel?: BindingLevel;
    initialSectorApplicability?: SectorApplicability[];
    initialRiskClassCoverage?: RiskClassCoverage[];
    initialCertificationAttestation?: CertificationAttestation[];
    initialAssessmentMode?: AssessmentMode[];
    
    // Callback to pass data back to parent
    onChange: (data: {
        authority_publisher?: AuthorityPublisher;
        binding_level?: BindingLevel;
        sector_applicability: SectorApplicability[];
        risk_class_coverage: RiskClassCoverage[];
        certification_attestation: CertificationAttestation[];
        assessment_mode: AssessmentMode[];
    }) => void;
}

export default function AdditionalInformation({
    initialAuthorityPublisher,
    initialBindingLevel,
    initialSectorApplicability = [],
    initialRiskClassCoverage = [],
    initialCertificationAttestation = [],
    initialAssessmentMode = [],
    onChange,
}: AdditionalInformationProps) {
    // Internal state management
    const [authorityPublisher, setAuthorityPublisher] = useState<AuthorityPublisher | undefined>(initialAuthorityPublisher);
    const [bindingLevel, setBindingLevel] = useState<BindingLevel | undefined>(initialBindingLevel);
    const [sectorApplicability, setSectorApplicability] = useState<SectorApplicability[]>(initialSectorApplicability);
    const [riskClassCoverage, setRiskClassCoverage] = useState<RiskClassCoverage[]>(initialRiskClassCoverage);
    const [certificationAttestation, setCertificationAttestation] = useState<CertificationAttestation[]>(initialCertificationAttestation);
    const [assessmentMode, setAssessmentMode] = useState<AssessmentMode[]>(initialAssessmentMode);

    // Use ref to track initialization to prevent calling onChange on mount
    const isInitialized = useRef(false);

    // Memoize options to prevent infinite re-renders
    const sectorApplicabilityOptions = useMemo(() => 
        Object.values(SectorApplicability).map(value => ({
            value: value,
            label: value
        })), []
    );

    const riskClassCoverageOptions = useMemo(() => 
        Object.values(RiskClassCoverage).map(value => ({
            value: value,
            label: value
        })), []
    );

    const certificationAttestationOptions = useMemo(() => 
        Object.values(CertificationAttestation).map(value => ({
            value: value,
            label: value
        })), []
    );

    const assessmentModeOptions = useMemo(() => 
        Object.values(AssessmentMode).map(value => ({
            value: value,
            label: value
        })), []
    );

    // Initialize state from props only once OR when props change (for editing mode)
    useEffect(() => {
        setAuthorityPublisher(initialAuthorityPublisher);
        setBindingLevel(initialBindingLevel);
        setSectorApplicability(initialSectorApplicability);
        setRiskClassCoverage(initialRiskClassCoverage);
        setCertificationAttestation(initialCertificationAttestation);
        setAssessmentMode(initialAssessmentMode);
        
        if (!isInitialized.current) {
            isInitialized.current = true;
        }
    }, [
        initialAuthorityPublisher,
        initialBindingLevel,
        JSON.stringify(initialSectorApplicability),
        JSON.stringify(initialRiskClassCoverage),
        JSON.stringify(initialCertificationAttestation),
        JSON.stringify(initialAssessmentMode)
    ]);

    // Memoized callback functions that call onChange directly
    const handleAuthorityPublisherChange = useCallback((value: AuthorityPublisher) => {
        setAuthorityPublisher(value);
        // Call onChange with updated values
        onChange({
            authority_publisher: value,
            binding_level: bindingLevel,
            sector_applicability: sectorApplicability,
            risk_class_coverage: riskClassCoverage,
            certification_attestation: certificationAttestation,
            assessment_mode: assessmentMode,
        });
    }, [bindingLevel, sectorApplicability, riskClassCoverage, certificationAttestation, assessmentMode, onChange]);

    const handleBindingLevelChange = useCallback((value: BindingLevel) => {
        setBindingLevel(value);
        // Call onChange with updated values
        onChange({
            authority_publisher: authorityPublisher,
            binding_level: value,
            sector_applicability: sectorApplicability,
            risk_class_coverage: riskClassCoverage,
            certification_attestation: certificationAttestation,
            assessment_mode: assessmentMode,
        });
    }, [authorityPublisher, sectorApplicability, riskClassCoverage, certificationAttestation, assessmentMode, onChange]);

    const handleSectorApplicabilityChange = useCallback((values: string[]) => {
        const newValues = values as SectorApplicability[];
        setSectorApplicability(newValues);
        // Call onChange with updated values
        onChange({
            authority_publisher: authorityPublisher,
            binding_level: bindingLevel,
            sector_applicability: newValues,
            risk_class_coverage: riskClassCoverage,
            certification_attestation: certificationAttestation,
            assessment_mode: assessmentMode,
        });
    }, [authorityPublisher, bindingLevel, riskClassCoverage, certificationAttestation, assessmentMode, onChange]);

    const handleRiskClassCoverageChange = useCallback((values: string[]) => {
        const newValues = values as RiskClassCoverage[];
        setRiskClassCoverage(newValues);
        // Call onChange with updated values
        onChange({
            authority_publisher: authorityPublisher,
            binding_level: bindingLevel,
            sector_applicability: sectorApplicability,
            risk_class_coverage: newValues,
            certification_attestation: certificationAttestation,
            assessment_mode: assessmentMode,
        });
    }, [authorityPublisher, bindingLevel, sectorApplicability, certificationAttestation, assessmentMode, onChange]);

    const handleCertificationAttestationChange = useCallback((values: string[]) => {
        const newValues = values as CertificationAttestation[];
        setCertificationAttestation(newValues);
        // Call onChange with updated values
        onChange({
            authority_publisher: authorityPublisher,
            binding_level: bindingLevel,
            sector_applicability: sectorApplicability,
            risk_class_coverage: riskClassCoverage,
            certification_attestation: newValues,
            assessment_mode: assessmentMode,
        });
    }, [authorityPublisher, bindingLevel, sectorApplicability, riskClassCoverage, assessmentMode, onChange]);

    const handleAssessmentModeChange = useCallback((values: string[]) => {
        const newValues = values as AssessmentMode[];
        setAssessmentMode(newValues);
        // Call onChange with updated values
        onChange({
            authority_publisher: authorityPublisher,
            binding_level: bindingLevel,
            sector_applicability: sectorApplicability,
            risk_class_coverage: riskClassCoverage,
            certification_attestation: certificationAttestation,
            assessment_mode: newValues,
        });
    }, [authorityPublisher, bindingLevel, sectorApplicability, riskClassCoverage, certificationAttestation, onChange]);
    return (
        <Card className="bg-white p-6">
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#171717]">Additional Information</h3>
                
                {/* Authority Publisher & Binding Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-[#171717] text-sm font-medium" htmlFor="authority_publisher">
                            Authority / Publisher
                        </Label>
                        <Select
                            value={authorityPublisher || ""}
                            onValueChange={(value) => handleAuthorityPublisherChange(value as AuthorityPublisher)}
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="ISO/IEC JTC 1/SC 42" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-auto">
                                <SelectItem value={AuthorityPublisher.ISO_IEC_JTC1_SC42}>ISO/IEC JTC 1/SC 42</SelectItem>
                                <SelectItem value={AuthorityPublisher.EU_COMMISSION}>European Commission</SelectItem>
                                <SelectItem value={AuthorityPublisher.NIST}>NIST</SelectItem>
                                <SelectItem value={AuthorityPublisher.ISO_IEC}>ISO/IEC (general)</SelectItem>
                                <SelectItem value={AuthorityPublisher.IEEE}>IEEE</SelectItem>
                                <SelectItem value={AuthorityPublisher.FTC}>Federal Trade Commission</SelectItem>
                                <SelectItem value={AuthorityPublisher.UK_ICO}>UK ICO</SelectItem>
                                <SelectItem value={AuthorityPublisher.OTHER}>Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-[#171717] text-sm font-medium" htmlFor="binding_level">
                            Binding Level
                        </Label>
                        <Select
                            value={bindingLevel || ""}
                            onValueChange={(value) => handleBindingLevelChange(value as BindingLevel)}
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Legally Binding" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={BindingLevel.BINDING}>Legally Binding</SelectItem>
                                <SelectItem value={BindingLevel.CERTIFIABLE}>Certifiable Standard</SelectItem>
                                <SelectItem value={BindingLevel.VOLUNTARY}>Voluntary / Best Practice</SelectItem>
                                <SelectItem value={BindingLevel.SUPERVISORY_EXPECTATION}>Supervisory Expectation</SelectItem>
                                <SelectItem value={BindingLevel.CONTRACTUAL}>Contractual</SelectItem>
                                <SelectItem value={BindingLevel.INTERNAL_MANDATORY}>Internal Mandatory</SelectItem>
                                <SelectItem value={BindingLevel.NA}>Not Applicable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Sector Applicability & Risk Class Coverage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-[#171717] text-sm font-medium">
                            Sector Applicability
                        </Label>
                        <CustomMultiSelect
                            options={sectorApplicabilityOptions}
                            value={sectorApplicability}
                            onChange={handleSectorApplicabilityChange}
                            placeholder="Cross-sector"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-[#171717] text-sm font-medium">
                            Risk Class Coverage
                        </Label>
                        <CustomMultiSelect
                            options={riskClassCoverageOptions}
                            value={riskClassCoverage}
                            onChange={handleRiskClassCoverageChange}
                            placeholder="Prohibited use cases"
                            className="mt-1"
                        />
                    </div>
                </div>

                {/* Certification & Assessment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-[#171717] text-sm font-medium">
                            Certification / Attestation
                        </Label>
                        <CustomMultiSelect
                            options={certificationAttestationOptions}
                            value={certificationAttestation}
                            onChange={handleCertificationAttestationChange}
                            placeholder="Notified Body Conformity Assessment"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-[#171717] text-sm font-medium">
                            Assessment Mode
                        </Label>
                        <CustomMultiSelect
                            options={assessmentModeOptions}
                            value={assessmentMode}
                            onChange={handleAssessmentModeChange}
                            placeholder="Self-Assessment"
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}
