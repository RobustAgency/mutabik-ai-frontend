"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateStakeholderMutation } from "@/app/lib/features/stakeholdersApi";
import { CreateStakeholderData } from "@/app/lib/features/stakeholdersApi";
import StakeholderForm from "./StakeholderForm";

const initialFormData: CreateStakeholderData = {
  type: "",
  display_name: "",
  legal_name: "",
  org_unit: "",
  email: "",
  phone: "",
  vendor_id: "",
  role_tags: [],
  timezone: "",
  classification: "",
  country: "",
  external_ref: "",
  active: true,
};

const CreateStakeholder: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] =
    useState<CreateStakeholderData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [createStakeholder, { isLoading }] = useCreateStakeholderMutation();

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields
    if (!formData.type?.trim()) {
      errors.type = ["Type is required"];
    }

    if (!formData.display_name?.trim()) {
      errors.display_name = ["Display name is required"];
    }

    if (!formData.legal_name?.trim()) {
      errors.legal_name = ["Legal name is required"];
    }

    if (!formData.org_unit?.trim()) {
      errors.org_unit = ["Organization unit is required"];
    }

    if (!formData.email?.trim()) {
      errors.email = ["Email is required"];
    } else if (!isValidEmail(formData.email)) {
      errors.email = ["Please enter a valid email address"];
    }

    if (!formData.phone?.trim()) {
      errors.phone = ["Phone is required"];
    }

    if (!formData.vendor_id?.trim()) {
      errors.vendor_id = ["Vendor ID is required"];
    }

    if (!formData.timezone?.trim()) {
      errors.timezone = ["Timezone is required"];
    }

    if (!formData.classification?.trim()) {
      errors.classification = ["Classification is required"];
    }

    if (!formData.country?.trim()) {
      errors.country = ["Country is required"];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side validation
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createStakeholder(formData).unwrap();
      router.push("/core-assets/stakeholders");
    } catch (err: any) {
      // Handle backend validation errors
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSave}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                New stakeholder
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Fill all the details below of your stakeholder
              </p>
            </div>
            <Button
              type="submit"
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save new stakeholder"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            {/* Show validation errors */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <StakeholderForm
              formData={formData}
              setFormData={setFormData}
              errors={validationErrors}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateStakeholder;
