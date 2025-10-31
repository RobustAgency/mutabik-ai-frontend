"use client";



import { useParams } from "next/navigation";
import RequirementForm from "@/components/admin/requirements/RequirementForm";

export default function EditRequirementPage() {
    const { id } = useParams();

    return <RequirementForm mode="edit" requirementId={id as string} />;
}
