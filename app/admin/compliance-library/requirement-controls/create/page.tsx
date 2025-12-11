"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RequirementControlForm from "@/components/admin/requirement-controls/RequirementControlForm";
import { useCreateRequirementControlMutation } from "@/app/lib/features/requirementControlsApi";
import { CreateRequirementControlRequest, UpdateRequirementControlRequest } from "@/interfaces/RequirementControl";
import { toast } from "react-toastify";

export default function CreateRequirementControlPage() {
  const router = useRouter();
  const [createRequirementControl] = useCreateRequirementControlMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (data: CreateRequirementControlRequest | UpdateRequirementControlRequest) => {
    try {
      setServerErrors({});
      await createRequirementControl(data as CreateRequirementControlRequest).unwrap();
      toast.success("Requirement control created successfully");
      router.push("/admin/compliance-library/requirement-controls");
    } catch (err: any) {
      console.error("Failed to create requirement control:", err);
      setServerErrors(err?.data?.errors || {});
      toast.error(err?.data?.message || "Failed to create requirement control");
      throw err;
    }
  };

  return (
    <RequirementControlForm
      mode="create"
      onSubmit={handleSubmit}
      serverErrors={serverErrors}
    />
  );
}

