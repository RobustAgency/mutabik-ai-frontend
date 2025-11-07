"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateStakeholderMutation, CreateStakeholderData, Stakeholder } from "@/app/lib/features/stakeholdersApi";
import StakeholderForm from "./StakeholderForm";
import { toast } from "react-toastify";

const initialFormData: CreateStakeholderData = {
    type: "person",
    display_name: "",
    legal_name: "",
    org_unit: "",
    email: "",
    phone: "",
    vendor_id: "",
    role_tags: [],
    timezone: "",
    classification: "internal",
    country: "",
    external_ref: "",
    active: true,
};

interface StakeholderModalFormProps {
    onSuccess?: (stakeholder: Stakeholder) => void;
    onCancel?: () => void;
}

const StakeholderModalForm: React.FC<StakeholderModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateStakeholderData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createStakeholder, { isLoading }] = useCreateStakeholderMutation();

    // Email validation helper
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Form validation
    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        // Required fields
        if (!formData.type?.trim()) {
            errors.type = ["Type is required"];
        }

        if (!formData.display_name?.trim()) {
            errors.display_name = ["Display name is required"];
        }

        if (!formData.legal_name?.trim()) {
            errors.legal_name = ["Legal name is required"];
        }

        if (!formData.org_unit?.trim()) {
            errors.org_unit = ["Organization unit is required"];
        }

        if (!formData.email?.trim()) {
            errors.email = ["Email is required"];
        } else if (!isValidEmail(formData.email)) {
            errors.email = ["Please enter a valid email address"];
        }

        if (!formData.phone?.trim()) {
            errors.phone = ["Phone is required"];
        }

        if (!formData.timezone?.trim()) {
            errors.timezone = ["Timezone is required"];
        }

        if (!formData.classification?.trim()) {
            errors.classification = ["Classification is required"];
        }

        if (!formData.country?.trim()) {
            errors.country = ["Country is required"];
        }

        if (!formData.role_tags || formData.role_tags.length === 0) {
            errors.role_tags = ["At least one role tag is required"];
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
            const result = await createStakeholder(formData).unwrap();

            // Call onSuccess callback with the created stakeholder
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

            <StakeholderForm
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
                    {isLoading ? "Creating..." : "Create Stakeholder"}
                </Button>
            </div>
        </form>
    );
};

export default StakeholderModalForm;

