"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Vendor, VendorType } from "@/app/lib/features/vendorsApi";
import { formatDateLongTime } from "@/lib/helpers/date";

interface VendorFormReadOnlyProps {
    vendor: Vendor;
}

const TYPE_LABELS: Record<VendorType, string> = {
    model_provider: "Model Provider",
    dataset_provider: "Dataset Provider",
    infrastructure_cloud: "Infrastructure/Cloud",
    saas_platform: "SaaS Platform",
    consulting_services: "Consulting/Services",
    hardware_provider: "Hardware Provider",
    api_service: "API Service",
    annotation_labeling: "Annotation/Labeling",
    other: "Other",
};

const STATUS_LABELS: Record<string, string> = {
    evaluating: "Evaluating",
    approved: "Approved",
    conditionally_approved: "Conditionally Approved",
    restricted: "Restricted",
    suspended: "Suspended",
    terminated: "Terminated",
};

const RISK_TIER_LABELS: Record<string, string> = {
    tier_1: "Tier 1",
    tier_2: "Tier 2",
    tier_3: "Tier 3",
    tier_4: "Tier 4",
};

const DATA_PROCESSING_ROLE_LABELS: Record<string, string> = {
    controller: "Controller",
    processor: "Processor",
    sub_processor: "Sub Processor",
    not_applicable: "Not Applicable",
};

const VendorFormReadOnly: React.FC<VendorFormReadOnlyProps> = ({
    vendor,
}) => {
    // Helper to format date time
    const formatDateTime = (dateString: string | null | undefined): string => {
        if (!dateString) return "Not specified";
        return formatDateLongTime(dateString);
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="display_id-display">Vendor ID</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {vendor.display_id || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vendor_name-display">Vendor Name</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {vendor.vendor_name}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="legal_name-display">Legal Name</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {vendor.legal_name}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hq_country-display">HQ Country</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {vendor.hq_country}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="risk_tier-display">Risk Tier</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {RISK_TIER_LABELS[vendor.risk_tier] || vendor.risk_tier}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status-display">Status</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            <span
                                className={`inline-flex items-center justify-center h-[24px] rounded-full text-xs font-medium px-2 ${
                                    vendor.status === "approved"
                                        ? "bg-[#ECFDF3] text-[#047857]"
                                        : vendor.status === "evaluating"
                                        ? "bg-[#FEF3C7] text-[#D97706]"
                                        : vendor.status === "restricted" || vendor.status === "suspended"
                                        ? "bg-[#FEE2E2] text-[#DC2626]"
                                        : "bg-[#F2F4F7] text-[#667085]"
                                }`}
                            >
                                {STATUS_LABELS[vendor.status] || vendor.status}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Vendor Classification */}
            <div className="space-y-4">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Vendor Classification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.type && vendor.type.length > 0 && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="type-display">Vendor Type</Label>
                            <div className="flex flex-wrap gap-2">
                                {vendor.type.map((typeValue) => (
                                    <Badge key={typeValue} variant="light" color="success">
                                        {TYPE_LABELS[typeValue] || typeValue}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {vendor.data_processing_role && (
                        <div className="space-y-2">
                            <Label htmlFor="data_processing_role-display">Data Processing Role</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {DATA_PROCESSING_ROLE_LABELS[vendor.data_processing_role] || vendor.data_processing_role}
                            </p>
                        </div>
                    )}

                    {vendor.service_provided && (
                        <div className="space-y-2">
                            <Label htmlFor="service_provided-display">Service Provided</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {vendor.service_provided}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Primary Contacts */}
            {vendor.primary_contacts && vendor.primary_contacts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                        Primary Contacts
                    </h3>

                    <div className="space-y-3">
                        {vendor.primary_contacts.map((contact, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-sm text-[#1D2939]">
                                        {contact.name}
                                        {contact.primary && (
                                            <Badge variant="light" color="success" className="ml-2">
                                                Primary
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#667085]">
                                    <div>
                                        <span className="font-medium">Email:</span> {contact.email}
                                    </div>
                                    {contact.phone && (
                                        <div>
                                            <span className="font-medium">Phone:</span> {contact.phone}
                                        </div>
                                    )}
                                    {contact.role && (
                                        <div>
                                            <span className="font-medium">Role:</span> {contact.role}
                                        </div>
                                    )}
                                </div>
                            </div>
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
                    {vendor.duns_number && (
                        <div className="space-y-2">
                            <Label htmlFor="duns_number-display">DUNS Number</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {vendor.duns_number}
                            </p>
                        </div>
                    )}

                    {vendor.lei_number && (
                        <div className="space-y-2">
                            <Label htmlFor="lei_number-display">LEI Number</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {vendor.lei_number}
                            </p>
                        </div>
                    )}

                    {vendor.tax_id && (
                        <div className="space-y-2">
                            <Label htmlFor="tax_id-display">Tax ID / VAT Number</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {vendor.tax_id}
                            </p>
                        </div>
                    )}

                    {vendor.stock_ticker && (
                        <div className="space-y-2">
                            <Label htmlFor="stock_ticker-display">Stock Ticker</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                                {vendor.stock_ticker}
                            </p>
                        </div>
                    )}

                    {vendor.notes && (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notes-display">Notes</Label>
                            <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939] whitespace-pre-wrap">
                                {vendor.notes}
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
                            {formatDateTime(vendor.created_at)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="updated_at-display">Updated At</Label>
                        <p className="font-sans font-normal text-base leading-6 tracking-normal text-[#1D2939]">
                            {formatDateTime(vendor.updated_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorFormReadOnly;

