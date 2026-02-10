"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OrganizationForm from "@/components/admin/organizations/OrganizationForm";
import { useCreateOrganizationMutation } from "@/app/lib/features/organizationsApi";
import { OrganizationFormData } from "@/lib/schemas/organization.schema";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [createOrganization, { isLoading }] = useCreateOrganizationMutation();
  const [serverErrors, setServerErrors] = React.useState<Record<string, string[]> | undefined>(undefined);

  const handleCancel = () => {
    router.push('/admin/organizations');
  };

  const handleSubmit = async (payload: OrganizationFormData) => {
    setServerErrors(undefined);
    try {
      await createOrganization(payload).unwrap();
      toast.success("Organization created successfully");
      router.push('/admin/organizations');
    } catch (err: any) {
      console.error("Failed to create organization:", err);
      const errors = err?.error?.data?.errors || err?.data?.errors;
      const errorMessage = err?.error?.data?.message || err?.data?.message || "Failed to create organization";
      
      if (errors) {
        setServerErrors(errors);
      }
      
      // Show toast for validation errors or general errors
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-2 py-4">
      <OrganizationForm
        mode="create"
        onCancel={handleCancel}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

