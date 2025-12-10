"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateVendorMutation, CreateVendorData, Vendor } from "@/app/lib/features/vendorsApi";
import VendorForm from "./VendorForm";
import {
    validateTextField,
    validateEmail,
    validateArrayField,
    createValidationErrors,
} from "@/lib/utils/validation";

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

    // Form validation using shared utilities
    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            vendor_name: validateTextField(formData.vendor_name, {
                required: true,
                messages: { required: "Vendor name is required" },
            }),
            legal_name: validateTextField(formData.legal_name, {
                required: true,
                messages: { required: "Legal name is required" },
            }),
            hq_country: validateTextField(formData.hq_country, {
                required: true,
                messages: { required: "Headquarters country is required" },
            }),
            risk_tier: validateTextField(formData.risk_tier, {
                required: true,
                messages: { required: "Risk tier is required" },
            }),
            status: validateTextField(formData.status, {
                required: true,
                messages: { required: "Status is required" },
            }),
            primary_contacts: validateArrayField(formData.primary_contacts, {
                required: false,
            }),
        };

        const contactErrors: Record<string, string[]> = {};
        formData.primary_contacts.forEach((contact, index) => {
            const nameErrors = validateTextField(contact.name, {
                required: true,
                messages: { required: "Contact name is required" },
            });
            if (nameErrors.length) {
                contactErrors[`primary_contacts.${index}.name`] = nameErrors;
            }

            const emailErrors = [
                ...validateTextField(contact.email, {
                    required: true,
                    messages: { required: "Contact email is required" },
                }),
                ...validateEmail(contact.email, "Please enter a valid email address"),
            ];
            if (emailErrors.length) {
                contactErrors[`primary_contacts.${index}.email`] = emailErrors;
            }
        });

        const errors = createValidationErrors({ ...fieldErrors, ...contactErrors });
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

