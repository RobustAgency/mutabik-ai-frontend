"use client";



import { useParams } from "next/navigation";
import RequirementForm from "@/components/admin/requirements/RequirementForm";
import React from "react";
import { useUpdateRequirementMutation } from "@/app/lib/features/requirementsApi";
import { useRouter } from "next/navigation";

export default function EditRequirementPage() {
    const params = useParams();
    const router = useRouter();
    const [updateRequirement] = useUpdateRequirementMutation();
    const [serverErrors, setServerErrors] = React.useState<Record<string, string[]> | undefined>(undefined);

    // Normalize id to string
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const requirementId = id || "";

    const handleSubmit = async (payload: any) => {
        if (!requirementId) return;
        setServerErrors(undefined);
        try {
            await updateRequirement({ id: requirementId, data: payload }).unwrap();
            router.push("/admin/compliance-library/requirements");
        } catch (err: any) {
            const errors = err?.data?.errors;
            if (errors) setServerErrors(errors);
            throw err;
        }
    };

    return <RequirementForm mode="edit" requirementId={requirementId} serverErrors={serverErrors} onSubmit={handleSubmit} />;
}
