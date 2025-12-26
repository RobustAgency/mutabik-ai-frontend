"use client";

import React, { useState } from "react";
import { useCreateVendorMutation, Vendor } from "@/app/lib/features/vendorsApi";
import VendorForm from "./VendorForm";
import BaseModalForm from "@/components/shared/BaseModalForm";
import { vendorSchema, type VendorFormData } from "@/lib/schemas/vendor.schema";

const initialFormData: VendorFormData = {
    vendor_name: "",
    legal_name: "",
    hq_country: "",
    risk_tier: "" as any, // Start empty to trigger validation
    status: "" as any, // Start empty to trigger validation
    type: [],
    data_processing_role: "" as any, // Start empty to trigger validation
    service_provided: null,
    primary_contacts: [],
    duns_number: null,
    lei_number: null,
    tax_id: null,
    stock_ticker: null,
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
    const [formData, setFormData] = useState<VendorFormData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createVendor, { isLoading }] = useCreateVendorMutation();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValidationErrors({});

        try {
            // Validate with Zod schema
            const validatedData = vendorSchema.parse(formData);
            
            const result = await createVendor(validatedData as any).unwrap();

            if (onSuccess) {
                onSuccess(result);
            }
            
            // Reset form on success
            setFormData(initialFormData);
        } catch (err: any) {
            // Handle Zod validation errors
            if (err?.errors) {
                const zodErrors: Record<string, string[]> = {};
                err.errors.forEach((error: any) => {
                    const field = error.path[0];
                    if (!zodErrors[field]) {
                        zodErrors[field] = [];
                    }
                    zodErrors[field].push(error.message);
                });
                setValidationErrors(zodErrors);
            }
            // Handle backend validation errors
            else if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
            }
        }
    };

    return (
        <BaseModalForm
            validationErrors={validationErrors}
            onSubmit={handleSave}
            onCancel={onCancel}
            isLoading={isLoading}
            submitButtonText="Create Vendor"
            cancelButtonText="Cancel"
        >
            <VendorForm
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
        </BaseModalForm>
    );
};

export default VendorModalForm;
