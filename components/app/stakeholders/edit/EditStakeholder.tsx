"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetStakeholderQuery, useUpdateStakeholderMutation, CreateStakeholderData } from "@/app/lib/features/stakeholdersApi";
import { stakeholderSchema, type StakeholderFormData } from "@/lib/schemas/stakeholder.schema";
import StakeholderForm from "../create/StakeholderForm";

interface EditStakeholderProps {
    stakeholderId: string;
}

const EditStakeholder: React.FC<EditStakeholderProps> = ({
    stakeholderId,
}) => {
    const router = useRouter();
    const [formData, setFormData] = useState<StakeholderFormData>({
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
        secondary_email: null,
        mobile: null,
        external_ref: null,
        employee_id: null,
        cost_center: null,
        manager: null,
        delegate: null,
        notes: null,
        start_date: null,
        end_date: null,
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const { data: stakeholder, isLoading: isLoadingStakeholder } = useGetStakeholderQuery(stakeholderId);
    const [updateStakeholder, { isLoading: isUpdating }] = useUpdateStakeholderMutation();

    // Populate form with existing data
    useEffect(() => {
        if (stakeholder) {
            setFormData({
                type: stakeholder.type as StakeholderFormData["type"],
                display_name: stakeholder.display_name,
                first_name: stakeholder.first_name || "",
                last_name: stakeholder.last_name || "",
                org_unit: stakeholder.org_unit,
                email: stakeholder.email,
                secondary_email: stakeholder.secondary_email || null,
                phone: stakeholder.phone,
                mobile: stakeholder.mobile || null,
                role_tags: stakeholder.role_tags || [],
                timezone: stakeholder.timezone,
                classification: stakeholder.classification as "internal" | "external",
                country: stakeholder.country || "",
                external_ref: stakeholder.external_ref || null,
                employee_id: stakeholder.employee_id || null,
                cost_center: stakeholder.cost_center || null,
                manager: stakeholder.manager || null,
                delegate: stakeholder.delegate || null,
                status: stakeholder.status as StakeholderFormData["status"],
                notes: stakeholder.notes || null,
                start_date: stakeholder.start_date || null,
                end_date: stakeholder.end_date || null,
            });
        }
    }, [stakeholder]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        // Validate using Zod schema
        const result = stakeholderSchema.safeParse(formData);
        if (!result.success) {
            const errors: Record<string, string[]> = {};
            result.error.issues.forEach((err) => {
                const path = err.path.join(".");
                errors[path] = [err.message];
            });
            setValidationErrors(errors);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Convert StakeholderFormData to CreateStakeholderData
        const updateData: CreateStakeholderData = {
            type: result.data.type,
            display_name: result.data.display_name,
            first_name: result.data.first_name,
            last_name: result.data.last_name,
            org_unit: result.data.org_unit,
            email: result.data.email,
            secondary_email: result.data.secondary_email || null,
            phone: result.data.phone,
            mobile: result.data.mobile || null,
            role_tags: result.data.role_tags,
            timezone: result.data.timezone,
            classification: result.data.classification,
            country: result.data.country,
            external_ref: result.data.external_ref || null,
            employee_id: result.data.employee_id || null,
            cost_center: result.data.cost_center || null,
            manager: result.data.manager || null,
            delegate: result.data.delegate || null,
            status: result.data.status,
            notes: result.data.notes || null,
            start_date: result.data.start_date || null,
            end_date: result.data.end_date || null,
        };

        try {
            await updateStakeholder({
                id: stakeholderId,
                data: updateData,
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

