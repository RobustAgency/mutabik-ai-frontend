"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import OrganizationForm from "@/components/admin/organizations/OrganizationForm";
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from "@/app/lib/features/organizationsApi";
import { OrganizationFormData } from "@/lib/schemas/organization.schema";
import Spinner from "@/components/ui/spinner";

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = Number(params.id);

  const { data: organization, isLoading: loadingOrganization } = useGetOrganizationQuery(organizationId);
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
  const [serverErrors, setServerErrors] = React.useState<Record<string, string[]> | undefined>(undefined);

  const handleCancel = () => {
    router.push(`/admin/organizations/${organizationId}`);
  };

  const handleSubmit = async (payload: OrganizationFormData) => {
    setServerErrors(undefined);
    try {
      const dataToSend: Partial<OrganizationFormData> = { ...payload };
      const originalWebsite = organization?.website || null;
      const newWebsite = payload.website || null;
      if (originalWebsite === newWebsite) {
        delete dataToSend.website;
      }

      await updateOrganization({ id: organizationId, data: dataToSend }).unwrap();
      toast.success("Organization updated successfully");
      router.push(`/admin/organizations`);
    } catch (err: any) {
      console.error("Failed to update organization:", err);
      const errors = err?.error?.data?.errors || err?.data?.errors;
      const errorMessage = err?.error?.data?.message || err?.data?.message || "Failed to update organization";

      if (errors) {
        setServerErrors(errors);
      }

      toast.error(errorMessage);
      throw err;
    }
  };

  if (loadingOrganization) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-2 py-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-2 py-4 flex items-center justify-center">
        <p className="text-gray-600">Organization not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-2 py-4">
      <OrganizationForm
        organization={organization}
        mode="edit"
        onCancel={handleCancel}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}


