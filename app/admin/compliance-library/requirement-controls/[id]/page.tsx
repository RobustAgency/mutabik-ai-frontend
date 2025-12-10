"use client";

import { useParams } from "next/navigation";
import RequirementControlForm from "@/components/admin/requirement-controls/RequirementControlForm";
import React from "react";
import { useUpdateRequirementControlMutation } from "@/app/lib/features/requirementControlsApi";
import { useRouter } from "next/navigation";
import { UpdateRequirementControlRequest } from "@/interfaces/RequirementControl";
import { toast } from "react-toastify";

export default function EditRequirementControlPage() {
  const params = useParams();
  const router = useRouter();
  const [updateRequirementControl] = useUpdateRequirementControlMutation();
  const [serverErrors, setServerErrors] = React.useState<Record<string, string[]>>({});

  // Normalize id to string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const requirementControlId = id || "";

  const handleSubmit = async (payload: UpdateRequirementControlRequest) => {
    if (!requirementControlId) return;
    setServerErrors({});
    try {
      await updateRequirementControl({ id: requirementControlId, data: payload }).unwrap();
      toast.success("Requirement control updated successfully");
      router.push("/admin/compliance-library/requirement-controls");
    } catch (err: any) {
      console.error("Failed to update requirement control:", err);
      const errors = err?.data?.errors;
      if (errors) setServerErrors(errors);
      toast.error(err?.data?.message || "Failed to update requirement control");
      throw err;
    }
  };

  return (
    <RequirementControlForm
      mode="edit"
      requirementControlId={requirementControlId}
      serverErrors={serverErrors}
      onSubmit={handleSubmit}
    />
  );
}

