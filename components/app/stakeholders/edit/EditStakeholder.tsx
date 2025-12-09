"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetStakeholderQuery, useUpdateStakeholderMutation, CreateStakeholderData } from "@/app/lib/features/stakeholdersApi";
import StakeholderForm from "../create/StakeholderForm";

interface EditStakeholderProps {
    stakeholderId: string;
}

const EditStakeholder: React.FC<EditStakeholderProps> = ({
    stakeholderId,
}) => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateStakeholderData>({
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
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const { data: stakeholder, isLoading: isLoadingStakeholder } = useGetStakeholderQuery(stakeholderId);
    const [updateStakeholder, { isLoading: isUpdating }] = useUpdateStakeholderMutation();

    // Populate form with existing data
    useEffect(() => {
        if (stakeholder) {
            setFormData({
                type: stakeholder.type as CreateStakeholderData["type"],
                display_name: stakeholder.display_name,
                legal_name: stakeholder.legal_name,
                org_unit: stakeholder.org_unit,
                email: stakeholder.email,
                phone: stakeholder.phone,
                vendor_id: stakeholder.vendor_id || "",
                role_tags: stakeholder.role_tags || [],
                timezone: stakeholder.timezone,
                classification: stakeholder.classification as "internal" | "external",
                country: stakeholder.country || "",
                external_ref: stakeholder.external_ref || "",
                active: stakeholder.active,
            });
        }
    }, [stakeholder]);

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

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            await updateStakeholder({
                id: stakeholderId,
                data: formData,
            }).unwrap();
            router.push("/core-assets/stakeholders");
        } catch (err: any) {
            // Handle backend validation errors
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    if (isLoadingStakeholder) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex items-center justify-center py-20">
                        <p className="text-[#667085]">Loading stakeholder details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stakeholder) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-[#667085]">Stakeholder not found</p>
                        <Button
                            onClick={() => router.push("/core-assets/stakeholders")}
                            className="bg-[#4FD58F] text-white"
                        >
                            Back to Stakeholders
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSave}>
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                        <div>
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                                Edit stakeholder
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                Update stakeholder registry information
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving..." : "Save changes"}
                        </Button>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        {/* Show validation errors */}
                        {Object.keys(validationErrors).length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-semibold mb-2">
                                        Please fix the following errors:
                                    </p>
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
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default EditStakeholder;

