"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { organizationSchema, OrganizationFormData } from "@/lib/schemas/organization.schema";
import { Organization } from "@/interfaces/Organization";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";
import Spinner from "@/components/ui/spinner";

interface OrganizationFormProps {
  organization?: Organization | null;
  mode: "create" | "edit";
  serverErrors?: Record<string, string[]>;
  onSubmit?: (payload: OrganizationFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function OrganizationForm({
  organization,
  mode,
  serverErrors,
  onSubmit,
  onCancel,
  isLoading = false,
}: OrganizationFormProps) {
  const methods = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema) as any,
    defaultValues: {
      name: "",
      website: null,
      phone: null,
      country: null,
      is_active: true,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = methods;

  const isActive = watch("is_active");

  // Initialize form with existing organization data
  useEffect(() => {
    if (organization && mode === "edit") {
      reset({
        name: organization.name || "",
        website: organization.website || null,
        phone: organization.phone || null,
        country: organization.country || null,
        is_active: organization.is_active ?? true,
      });
    }
  }, [organization, mode, reset]);

  // Sync external errors into react-hook-form
  useEffect(() => {
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([field, fieldErrors]) => {
        if (fieldErrors && fieldErrors[0]) {
          methods.setError(field as any, {
            type: "manual",
            message: fieldErrors[0],
          });
        }
      });
    }
  }, [serverErrors, methods]);

  const handleFormSubmit = handleSubmit(async (data: OrganizationFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  });

  const hasError = (fieldName: keyof OrganizationFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof OrganizationFormData) =>
    errors[fieldName]?.message as string;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit}>
        <Card className="bg-white rounded-xl">
          <CardContent className="p-6 space-y-6">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-6">
              {mode === "create" ? "Create Organization" : "Edit Organization"}
            </CardTitle>

            {serverErrors && Object.keys(serverErrors).length > 0 && (
              <FormErrorAlert errors={serverErrors} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={hasError("name") ? "border-red-500" : ""}
                  placeholder="Enter organization name"
                />
                {hasError("name") && (
                  <p className="text-sm text-red-500">{getError("name")}</p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("country")}
                  className={hasError("country") ? "border-red-500" : ""}
                  placeholder="Enter country"
                />
                {hasError("country") && (
                  <p className="text-sm text-red-500">{getError("country")}</p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...register("website")}
                  className={hasError("website") ? "border-red-500" : ""}
                  placeholder="https://example.com"
                />
                {hasError("website") && (
                  <p className="text-sm text-red-500">{getError("website")}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={hasError("phone") ? "border-red-500" : ""}
                  placeholder="Enter phone number"
                />
                {hasError("phone") && (
                  <p className="text-sm text-red-500">{getError("phone")}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="space-y-2">
                <Label htmlFor="is_active">
                  Status <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue("is_active", checked)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
                {hasError("is_active") && (
                  <p className="text-sm text-red-500">{getError("is_active")}</p>
                )}
              </div>
            </div>

            <FormActions
              onCancel={onCancel}
              isLoading={isLoading}
              isEditing={mode === "edit"}
              submitLabel={mode === "create" ? "Create Organization" : "Update Organization"}
            />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}

