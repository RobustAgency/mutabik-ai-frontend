"use client";

import React, { useState } from "react";
import { useCreateStakeholderMutation, Stakeholder } from "@/app/lib/features/stakeholdersApi";
import StakeholderForm from "./StakeholderForm";
import BaseModalForm from "@/components/shared/BaseModalForm";
import { stakeholderSchema, type StakeholderFormData } from "@/lib/schemas/stakeholder.schema";

const initialFormData: StakeholderFormData = {
    type: "person",
    display_name: "",
    first_name: "",
    last_name: "",
    org_unit: "",
    email: "",
    phone: "",
    role_tags: [],
    timezone: "",
    classification: "internal",
    country: "",
    status: "active",
    external_ref: null,
    secondary_email: null,
    mobile: null,
    employee_id: null,
    cost_center: null,
    manager: null,
    delegate: null,
    notes: null,
    start_date: null,
    end_date: null,
};

interface StakeholderModalFormProps {
    onSuccess?: (stakeholder: Stakeholder) => void;
    onCancel?: () => void;
}

const StakeholderModalForm: React.FC<StakeholderModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<StakeholderFormData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createStakeholder, { isLoading }] = useCreateStakeholderMutation();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValidationErrors({});

        try {
            // Validate with Zod schema (Zod schema transforms the data, so we get the correct type)
            const validatedData = stakeholderSchema.parse(formData);
            
            const result = await createStakeholder(validatedData).unwrap();

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
            submitButtonText="Create Stakeholder"
            cancelButtonText="Cancel"
        >
            <StakeholderForm
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
        </BaseModalForm>
    );
};

export default StakeholderModalForm;
