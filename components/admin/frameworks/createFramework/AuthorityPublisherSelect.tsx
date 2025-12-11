"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthorityPublisher } from "@/interfaces/Framework";

interface AuthorityPublisherSelectProps {
    value: AuthorityPublisher | undefined;
    onValueChange: (value: AuthorityPublisher) => void;
    placeholder?: string;
    className?: string;
}

// Define grouped options with disabled group headers
const AUTHORITY_PUBLISHER_GROUPS = [
    {
        groupLabel: "International/Standards",
        isDisabled: true,
        options: [
            { value: AuthorityPublisher.ISO_IEC_JTC1_SC42, label: "ISO/IEC JTC 1/SC 42" },
            { value: AuthorityPublisher.ISO_IEC, label: "ISO/IEC (general)" },
            { value: AuthorityPublisher.IEC, label: "International Electrotechnical Commission" },
            { value: AuthorityPublisher.IEEE, label: "IEEE" },
            { value: AuthorityPublisher.OECD, label: "OECD" },
            { value: AuthorityPublisher.UNESCO, label: "UNESCO" },
            { value: AuthorityPublisher.COUNCIL_OF_EUROPE, label: "Council of Europe" },
        ]
    },
    {
        groupLabel: "EU",
        isDisabled: true,
        options: [
            { value: AuthorityPublisher.EU_PARLIAMENT_COUNCIL, label: "EU Parliament & Council" },
            { value: AuthorityPublisher.EU_COMMISSION, label: "European Commission" },
            { value: AuthorityPublisher.EDPB, label: "European Data Protection Board" },
            { value: AuthorityPublisher.ENISA, label: "ENISA (EU Cybersecurity)" },
            { value: AuthorityPublisher.EBA, label: "European Banking Authority" },
            { value: AuthorityPublisher.ESMA, label: "ESMA" },
            { value: AuthorityPublisher.EIOPA, label: "EIOPA" },
            { value: AuthorityPublisher.ECB, label: "European Central Bank" },
        ]
    },
    {
        groupLabel: "US",
        isDisabled: true,
        options: [
            { value: AuthorityPublisher.NIST, label: "NIST" },
            { value: AuthorityPublisher.FTC, label: "Federal Trade Commission" },
            { value: AuthorityPublisher.SEC_US, label: "U.S. SEC" },
            { value: AuthorityPublisher.FRB, label: "Federal Reserve Board" },
            { value: AuthorityPublisher.OCC, label: "Office of the Comptroller of the Currency" },
            { value: AuthorityPublisher.FDIC, label: "FDIC" },
            { value: AuthorityPublisher.CFPB, label: "CFPB" },
            { value: AuthorityPublisher.NTIA, label: "NTIA" },
        ]
    },
    {
        groupLabel: "UK",
        isDisabled: true,
        options: [
            { value: AuthorityPublisher.UK_ICO, label: "UK ICO" },
            { value: AuthorityPublisher.UK_FCA, label: "UK FCA" },
            { value: AuthorityPublisher.PRA_BOE, label: "Prudential Regulation Authority (BoE)" },
            { value: AuthorityPublisher.UK_DSI_ASI, label: "UK Department for Science & AI Safety Institute" },
        ]
    },
    {
        groupLabel: "GCC / Middle East",
        isDisabled: true,
        options: [
            { value: AuthorityPublisher.UAE_DATA_OFFICE, label: "UAE Data Office" },
            { value: AuthorityPublisher.CBUAE, label: "Central Bank of the UAE" },
            { value: AuthorityPublisher.ADGM_FSRA, label: "ADGM FSRA" },
            { value: AuthorityPublisher.DFSA, label: "DFSA (DIFC)" },
            { value: AuthorityPublisher.SDAIA_NDMO, label: "KSA SDAIA / NDMO" },
            { value: AuthorityPublisher.SAMA, label: "Saudi Central Bank (SAMA)" },
            { value: AuthorityPublisher.NCA_KSA, label: "National Cybersecurity Authority (KSA)" },
            { value: AuthorityPublisher.CBJ, label: "Central Bank of Jordan" },
            { value: AuthorityPublisher.CBB, label: "Central Bank of Bahrain" },
            { value: AuthorityPublisher.QCB, label: "Qatar Central Bank" },
            { value: AuthorityPublisher.QFCRA, label: "Qatar Financial Centre Regulatory Authority" },
            { value: AuthorityPublisher.CBK, label: "Central Bank of Kuwait" },
            { value: AuthorityPublisher.CBO, label: "Central Bank of Oman" },
        ]
    },
    {
        groupLabel: "APAC / Others",
        isDisabled: true,
        options: [
            { value: AuthorityPublisher.MAS, label: "Monetary Authority of Singapore" },
            { value: AuthorityPublisher.HKMA, label: "Hong Kong Monetary Authority" },
            { value: AuthorityPublisher.OSFI, label: "OSFI (Canada)" },
            { value: AuthorityPublisher.OAIC_AU, label: "OAIC (Australia privacy)" },
            { value: AuthorityPublisher.APRA, label: "APRA (Australia)" },
            { value: AuthorityPublisher.OTHER, label: "Other" },
        ]
    }
];

export default function AuthorityPublisherSelect({
    value,
    onValueChange,
    placeholder = "Select Authority / Publisher",
    className
}: AuthorityPublisherSelectProps) {
    return (
        <Select
            key={`authority-publisher-select-${value || "none"}`}
            value={value || ""}
            onValueChange={(selectedValue) => onValueChange(selectedValue as AuthorityPublisher)}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
                {AUTHORITY_PUBLISHER_GROUPS.map((group, groupIndex) => (
                    <React.Fragment key={group.groupLabel}>
                        {/* Group Header - disabled and styled */}
                        <SelectItem 
                            value={`group-header-${groupIndex}`} 
                            disabled
                            className="font-medium text-gray-500 bg-gray-50 cursor-default opacity-70 hover:bg-gray-50"
                        >
                            {group.groupLabel}
                        </SelectItem>
                        
                        {/* Group Options */}
                        {group.options.map((option) => (
                            <SelectItem 
                                key={`authority-publisher-option-${option.value}`} 
                                value={option.value}
                                className="pl-6" // Indent to show hierarchy
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                        
                        {/* Add separator between groups except for the last one */}
                        {groupIndex < AUTHORITY_PUBLISHER_GROUPS.length - 1 && (
                            <div className="border-t border-gray-100 my-1" />
                        )}
                    </React.Fragment>
                ))}
            </SelectContent>
        </Select>
    );
}
