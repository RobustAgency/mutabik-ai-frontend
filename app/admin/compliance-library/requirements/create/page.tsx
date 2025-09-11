"use client"

export const runtime = 'edge';
import RequirementForm from "@/components/admin/requirements/RequirementForm";

export default function CreateRequirementPage() {
  return <RequirementForm mode="create" />;
}
