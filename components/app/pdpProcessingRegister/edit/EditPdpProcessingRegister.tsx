"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetPdpProcessingRegisterQuery, useUpdatePdpProcessingRegisterMutation, CreatePdpProcessingRegisterData } from "@/app/lib/features/pdpProcessingRegisterApi";
import PdpProcessingRegisterForm from "../create/PdpProcessingRegisterForm";

interface EditPdpProcessingRegisterProps {
    registerId: string;
}

const EditPdpProcessingRegister: React.FC<EditPdpProcessingRegisterProps> = ({ registerId }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreatePdpProcessingRegisterData>({
        purpose: "",
        controller_role: "",
        data_subject_categories: [],
        personal_data_categories: [],
        lawful_basis: "",
        lawful_basis_detail: "",
        retention_policy_ref: "",
        recipients: [],
        international_transfer_ref: "",
        dpia_required_flag: "",
        security_measures_ref: "",
        owner_team: "",
        effective_from: "",
        effective_to: "",
        status: "",
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const { data: register, isLoading: isLoadingRegister } = useGetPdpProcessingRegisterQuery(registerId);
    const [updateRegister, { isLoading: isUpdating }] = useUpdatePdpProcessingRegisterMutation();

    useEffect(() => {
        if (register) {
            setFormData({
                purpose: register.purpose,
                controller_role: register.controller_role,
                data_subject_categories: register.data_subject_categories || [],
                personal_data_categories: register.personal_data_categories || [],
                lawful_basis: register.lawful_basis,
                lawful_basis_detail: register.lawful_basis_detail || "",
                retention_policy_ref: register.retention_policy_ref || "",
                recipients: register.recipients || [],
                international_transfer_ref: register.international_transfer_ref || "",
                dpia_required_flag: register.dpia_required_flag || "",
                security_measures_ref: register.security_measures_ref || "",
                owner_team: register.owner_team,
                effective_from: register.effective_from,
                effective_to: register.effective_to || "",
                status: register.status,
            });
        }
    }, [register]);

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.purpose?.trim()) errors.purpose = ["Purpose is required"];
        if (!formData.controller_role?.trim()) errors.controller_role = ["Controller role is required"];
        if (!formData.data_subject_categories || formData.data_subject_categories.length === 0) errors.data_subject_categories = ["At least one data subject category is required"];
        if (!formData.personal_data_categories || formData.personal_data_categories.length === 0) errors.personal_data_categories = ["At least one personal data category is required"];
        if (!formData.lawful_basis?.trim()) errors.lawful_basis = ["Lawful basis is required"];
        if (!formData.owner_team?.trim()) errors.owner_team = ["Owner team is required"];
        if (!formData.effective_from?.trim()) errors.effective_from = ["Effective from date is required"];
        if (!formData.status?.trim()) errors.status = ["Status is required"];

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            await updateRegister({ id: registerId, data: formData }).unwrap();
            router.push("/privacy/pdp-register");
        } catch (err: any) {
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    if (isLoadingRegister) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <p className="text-center text-muted-foreground">Loading register...</p>
                </Card>
            </div>
        );
    }

    if (!register) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <p className="text-center text-destructive">Processing register not found</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleUpdate}>
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                        <div>
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit PDP Processing Register</h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update processing activity record</p>
                        </div>
                        <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update Register"}
                        </Button>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        {Object.keys(validationErrors).length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-semibold mb-2">Please fix the following errors:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Object.entries(validationErrors).map(([field, errors]) => (
                                            <li key={field}>
                                                <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {errors[0]}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <PdpProcessingRegisterForm formData={formData} setFormData={setFormData} errors={validationErrors} />
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default EditPdpProcessingRegister;

