"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FrameworkForm from "@/components/admin/frameworks/createFramework/FrameworkForm";
import { useCreateFrameworkMutation } from "@/app/lib/features/frameworksApi";

export default function CreateFrameworkPage() {
  const router = useRouter();
  const [createFramework] = useCreateFrameworkMutation();
  const [serverErrors, setServerErrors] = React.useState<Record<string, string[]> | undefined>(undefined);

  const handleCancel = () => {
    router.push('/admin/compliance-library/frameworks');
  };

  const handleSubmit = async (payload: any) => {
    setServerErrors(undefined);
    try {
      await createFramework(payload).unwrap();
      router.push('/admin/compliance-library/frameworks');
    } catch (err: any) {
      const errors = err?.data?.errors;
      if (errors) {
        setServerErrors(errors);
      }
      throw err;
    }
  };

  return (
    <FrameworkForm
      isEditing={false}
      onCancel={handleCancel}
      serverErrors={serverErrors}
      onSubmit={handleSubmit}
    />
  );
}
