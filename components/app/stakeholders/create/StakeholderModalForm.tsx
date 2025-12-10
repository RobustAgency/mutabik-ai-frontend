"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateStakeholderMutation, CreateStakeholderData, Stakeholder } from "@/app/lib/features/stakeholdersApi";
import StakeholderForm from "./StakeholderForm";
import {
    validateTextField,
    validateEmail,
    validateArrayField,
    createValidationErrors,
} from "@/lib/utils/validation";

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

    // Form validation using shared utilities
    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            type: validateTextField(formData.type, {
                required: true,
                messages: { required: "Type is required" },
            }),
            display_name: validateTextField(formData.display_name, {
                required: true,
                messages: { required: "Display name is required" },
            }),
            legal_name: validateTextField(formData.legal_name, {
                required: true,
                messages: { required: "Legal name is required" },
            }),
            org_unit: validateTextField(formData.org_unit, {
                required: true,
                messages: { required: "Organization unit is required" },
            }),
            email: [
                ...validateTextField(formData.email, {
                    required: true,
                    messages: { required: "Email is required" },
                }),
                ...validateEmail(formData.email),
            ],
            phone: validateTextField(formData.phone, {
                required: true,
                messages: { required: "Phone is required" },
            }),
            timezone: validateTextField(formData.timezone, {
                required: true,
                messages: { required: "Timezone is required" },
            }),
            classification: validateTextField(formData.classification, {
                required: true,
                messages: { required: "Classification is required" },
            }),
            country: validateTextField(formData.country, {
                required: true,
                messages: { required: "Country is required" },
            }),
            role_tags: validateArrayField(formData.role_tags, {
                required: true,
                messages: { required: "At least one role tag is required" },
            }),
        };

        const errors = createValidationErrors(fieldErrors);
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

