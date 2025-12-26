"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Stakeholder } from "@/app/lib/features/stakeholdersApi";
import { formatDateLongTime } from "@/lib/helpers/date";

interface StakeholderFormReadOnlyProps {
    stakeholder: Stakeholder;
}

// Role options matching the create form
const ROLE_OPTIONS = [
    // AI/ML Governance Roles
    { value: "model_owner", label: "Model Owner", category: "AI/ML" },
    { value: "data_scientist", label: "Data Scientist", category: "AI/ML" },
    { value: "ml_engineer", label: "ML Engineer", category: "AI/ML" },
    { value: "ai_governance", label: "AI Governance Lead", category: "AI/ML" },
    // Data Governance Roles
    { value: "data_owner", label: "Data Owner", category: "Data" },
    { value: "data_steward", label: "Data Steward", category: "Data" },
    { value: "data_custodian", label: "Data Custodian", category: "Data" },
    { value: "data_engineer", label: "Data Engineer", category: "Data" },
    // Privacy & Compliance Roles
    { value: "dpo", label: "Data Protection Officer (DPO)", category: "Privacy" },
    { value: "privacy_officer", label: "Privacy Officer", category: "Privacy" },
    { value: "compliance_officer", label: "Compliance Officer", category: "Privacy" },
    // Risk & Security Roles
    { value: "risk_analyst", label: "Risk Analyst", category: "Risk" },
    { value: "security_ir", label: "Security IR", category: "Risk" },
    { value: "ciso", label: "CISO", category: "Risk" },
    // Business Roles
    { value: "business_owner", label: "Business Owner", category: "Business" },
    { value: "product_owner", label: "Product Owner", category: "Business" },
    { value: "individual_contributor", label: "Individual Contributor", category: "Business" },
    // Approval Authority
    { value: "approver_l1", label: "Approver - Level 1", category: "Approval" },
    { value: "approver_l2", label: "Approver - Level 2", category: "Approval" },
    { value: "executive_sponsor", label: "Executive Sponsor", category: "Approval" },
];

const STATUS_LABELS: Record<string, string> = {
    active: "Active",
    in_active: "In Active",
    on_leave: "On Leave",
    off_boarded: "Off Boarded",
};

const TYPE_LABELS: Record<string, string> = {
    person: "Person",
    team: "Team",
    vendor_org: "Vendor",
    regulator: "Regulator",
    customer_group: "Customer Group",
    committee_secretariat: "Committee Secretariat",
};

const StakeholderFormReadOnly: React.FC<StakeholderFormReadOnlyProps> = ({
    stakeholder,
}) => {
    const getRoleLabel = (value: string): string => {
        const role = ROLE_OPTIONS.find((r) => r.value === value);
        return role ? role.label : value;
    };

    // Helper to format date (handles both date-only and datetime strings)
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "Not specified";
        try {
            // If it's already a formatted date string, try to parse it
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // Return original if invalid
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Helper to format date time
    const formatDateTime = (dateString: string | null | undefined): string => {
        if (!dateString) return "Not specified";
        return formatDateLongTime(dateString);
    };

    const fullName = stakeholder.first_name || stakeholder.last_name
        ? `${stakeholder.first_name || ""} ${stakeholder.last_name || ""}`.trim()
        : "Not specified";

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="display_id-display">Stakeholder ID</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.display_id || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type-display">Type</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {TYPE_LABELS[stakeholder.type] || stakeholder.type}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="display_name-display">Display Name</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.display_name}
                        </p>
                    </div>

                    {stakeholder.first_name && (
                        <div className="space-y-2">
                            <Label htmlFor="first_name-display">First Name</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.first_name}
                            </p>
                        </div>
                    )}

                    {stakeholder.last_name && (
                        <div className="space-y-2">
                            <Label htmlFor="last_name-display">Last Name</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.last_name}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name-display">Full Name</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {fullName}
                        </p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
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

                    {stakeholder.secondary_email && (
                        <div className="space-y-2">
                            <Label htmlFor="secondary_email-display">Secondary Email</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.secondary_email}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="phone-display">Phone</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {stakeholder.phone}
                        </p>
                    </div>

                    {stakeholder.mobile && (
                        <div className="space-y-2">
                            <Label htmlFor="mobile-display">Mobile</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.mobile}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Organization Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                        <Label htmlFor="status-display">Status</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            <span
                                className={`inline-flex items-center justify-center h-[24px] rounded-full text-xs font-medium px-2 ${
                                    stakeholder.status === "active"
                                        ? "bg-[#ECF3FF] text-[#465FFF]"
                                        : "bg-[#F2F4F7] text-[#667085]"
                                }`}
                            >
                                {STATUS_LABELS[stakeholder.status] || stakeholder.status}
                            </span>
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
                            <Badge key={index} variant="light" color="success">
                                {getRoleLabel(tag)}
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
                    {stakeholder.external_ref && (
                        <div className="space-y-2">
                            <Label htmlFor="external_ref-display">External Reference</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.external_ref}
                            </p>
                        </div>
                    )}

                    {stakeholder.employee_id && (
                        <div className="space-y-2">
                            <Label htmlFor="employee_id-display">Employee ID</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.employee_id}
                            </p>
                        </div>
                    )}

                    {stakeholder.cost_center && (
                        <div className="space-y-2">
                            <Label htmlFor="cost_center-display">Cost Center</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.cost_center}
                            </p>
                        </div>
                    )}

                    {stakeholder.manager && (
                        <div className="space-y-2">
                            <Label htmlFor="manager-display">Manager</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.manager}
                            </p>
                        </div>
                    )}

                    {stakeholder.delegate && (
                        <div className="space-y-2">
                            <Label htmlFor="delegate-display">Delegate</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {stakeholder.delegate}
                            </p>
                        </div>
                    )}

                    {stakeholder.start_date && (
                        <div className="space-y-2">
                            <Label htmlFor="start_date-display">Start Date</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {formatDate(stakeholder.start_date)}
                            </p>
                        </div>
                    )}

                    {stakeholder.end_date && (
                        <div className="space-y-2">
                            <Label htmlFor="end_date-display">End Date</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {formatDate(stakeholder.end_date)}
                            </p>
                        </div>
                    )}

                    {stakeholder.notes && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notes-display">Notes</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939] whitespace-pre-wrap">
                                {stakeholder.notes}
                            </p>
                        </div>
                    )}
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
                            {formatDateTime(stakeholder.created_at)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="updated_at-display">Updated At</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {formatDateTime(stakeholder.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakeholderFormReadOnly;
