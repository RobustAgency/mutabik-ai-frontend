"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateVendorMutation, CreateVendorData, Vendor } from "@/app/lib/features/vendorsApi";
import VendorForm from "./VendorForm";

const initialFormData: CreateVendorData = {
    vendor_name: "",
    legal_name: "",
    hq_country: "",
    risk_tier: "tier_1",
    status: "evaluating",
    stakeholder_id: null,
    primary_contacts: [],
    metadata: {},
    notes: null,
};

interface VendorModalFormProps {
    onSuccess?: (vendor: Vendor) => void;
    onCancel?: () => void;
}

const VendorModalForm: React.FC<VendorModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateVendorData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createVendor, { isLoading }] = useCreateVendorMutation();

    // Form validation
    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        // Required fields
        if (!formData.vendor_name?.trim()) {
            errors.vendor_name = ["Vendor name is required"];
        }

        if (!formData.legal_name?.trim()) {
            errors.legal_name = ["Legal name is required"];
        }

        if (!formData.hq_country?.trim()) {
            errors.hq_country = ["Headquarters country is required"];
        }

        if (!formData.risk_tier) {
            errors.risk_tier = ["Risk tier is required"];
        }

        if (!formData.status) {
            errors.status = ["Status is required"];
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event from bubbling to parent form
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            return;
        }

        try {
            const result = await createVendor(formData).unwrap();

            // Call onSuccess callback with the created vendor
            if (onSuccess) {
                onSuccess(result);
            }
        } catch (err: any) {
            // Handle backend validation errors
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Show validation errors */}
            {Object.keys(validationErrors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <p className="font-semibold mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(validationErrors).map(([field, errors]) => (
                                <li key={field}>
                                    <span className="font-medium capitalize">
                                        {field.replace(/_/g, " ")}:
                                    </span>{" "}
                                    {errors[0]}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <VendorForm
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-[#4FD58F] hover:bg-[#3fc77f]"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Vendor"}
                </Button>
            </div>
        </form>
    );
};

export default VendorModalForm;

