"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Stakeholder } from "@/app/lib/features/stakeholdersApi";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import { formatDateLongTime } from "@/lib/helpers/date";

interface StakeholderFormReadOnlyProps {
    stakeholder: Stakeholder;
}

const StakeholderFormReadOnly: React.FC<StakeholderFormReadOnlyProps> = ({
    stakeholder,
}) => {
    const { data: vendorsResponse } = useGetVendorsQuery();
    const vendors = vendorsResponse?.data ?? [];

    // Get vendor name if vendor_id exists
    const vendor = stakeholder.vendor_id
        ? vendors.find((v) => String(v.id) === String(stakeholder.vendor_id))
        : null;

    const ROLE_TAG_OPTIONS = [
        { value: "model_owner", label: "Model Owner" },
        { value: "risk_analyst", label: "Risk Analyst" },
        { value: "IC", label: "Individual Contributor" },
        { value: "DS", label: "Data Scientist" },
        { value: "security_IR", label: "Security IR" },
    ];

    const getRoleTagLabel = (value: string): string => {
        const found = ROLE_TAG_OPTIONS.find((opt) => opt.value === value);
        return found ? found.label : value;
    };

    // Helper to format date
    const formatDate = (dateString: string): string => formatDateLongTime(dateString);

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type-display">Type</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.type}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="display_name-display">Display Name</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.display_name}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="legal_name-display">Legal Name</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.legal_name}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="org_unit-display">Organization Unit</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.org_unit}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email-display">Email</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.email}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone-display">Phone</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.phone}
                        </p>
                    </div>
                </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Organization Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="vendor_id-display">Linked Vendor</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {vendor ? vendor.vendor_name : stakeholder.vendor_id || "Not linked"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="classification-display">Classification</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939] capitalize">
                            {stakeholder.classification}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country-display">Country</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.country || "Not specified"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone-display">Timezone</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.timezone}
                        </p>
                    </div>
                </div>
            </div>

            {/* Role Tags */}
            {stakeholder.role_tags && stakeholder.role_tags.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                        Role Tags
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {stakeholder.role_tags.map((tag, index) => (
                            <Badge key={index} variant="light">
                                {getRoleTagLabel(tag)}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="external_ref-display">External Reference</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.external_ref || "Not specified"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="active-display">Status</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            <span
                                className={`inline-flex items-center justify-center h-[24px] rounded-full text-xs font-medium px-2 ${stakeholder.active
                                    ? "bg-[#ECF3FF] text-[#465FFF]"
                                    : "bg-[#F2F4F7] text-[#667085]"
                                    }`}
                            >
                                {stakeholder.active ? "Active" : "Inactive"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Metadata
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="created_at-display">Created At</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {formatDate(stakeholder.created_at)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="updated_at-display">Updated At</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {formatDate(stakeholder.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakeholderFormReadOnly;

