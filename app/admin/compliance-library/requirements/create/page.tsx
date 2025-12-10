"use client"


import RequirementForm from "@/components/admin/requirements/RequirementForm";
import React from "react";
import { useRouter } from "next/navigation";
import { useCreateRequirementMutation } from "@/app/lib/features/requirementsApi";

export default function CreateRequirementPage() {
  const router = useRouter();
  const [createRequirement] = useCreateRequirementMutation();
  const [serverErrors, setServerErrors] = React.useState<Record<string, string[]> | undefined>(undefined);

  const handleSubmit = async (payload: any) => {
    setServerErrors(undefined);
    try {
      await createRequirement(payload).unwrap();
      router.push("/admin/compliance-library/requirements");
    } catch (err: any) {
      const errors = err?.data?.errors;
      if (errors) setServerErrors(errors);
      throw err;
    }
  };

  return <RequirementForm mode="create" serverErrors={serverErrors} onSubmit={handleSubmit} />;
}
