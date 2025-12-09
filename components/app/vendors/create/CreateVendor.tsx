"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateVendorMutation,
  CreateVendorData,
} from "@/app/lib/features/vendorsApi";
import {
  validateTextField,
  validateEmail,
  validateArrayField,
  createValidationErrors,
} from "@/lib/utils/validation";
import VendorForm from "./VendorForm";

const initialFormData: CreateVendorData = {
  vendor_name: "",
  legal_name: "",
  hq_country: "",
  risk_tier: "tier_1",
  status: "evaluating",
  stakeholder_id: null,
  primary_contacts: [],
  metadata: {},
  notes: null,
};

const CreateVendor: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateVendorData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [createVendor, { isLoading }] = useCreateVendorMutation();

  // Form validation using shared utilities
  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      vendor_name: validateTextField(formData.vendor_name, {
        required: true,
        messages: { required: "Vendor name is required" },
      }),
      legal_name: validateTextField(formData.legal_name, {
        required: true,
        messages: { required: "Legal name is required" },
      }),
      hq_country: validateTextField(formData.hq_country, {
        required: true,
        messages: { required: "HQ country is required" },
      }),
      risk_tier: validateTextField(formData.risk_tier, {
        required: true,
        messages: { required: "Risk tier is required" },
      }),
      status: validateTextField(formData.status, {
        required: true,
        messages: { required: "Status is required" },
      }),
      // primary contacts array required only when provided, so validate presence of required fields per contact
      primary_contacts: validateArrayField(formData.primary_contacts, {
        required: false,
      }),
    };

    // stakeholder_id required by backend
    if (formData.stakeholder_id === null || formData.stakeholder_id === undefined) {
      fieldErrors.stakeholder_id = ["Stakeholder is required"];
    }

    // Validate primary contacts fields
    const contactErrors: Record<string, string[]> = {};
    formData.primary_contacts.forEach((contact, index) => {
      const nameErrors = validateTextField(contact.name, {
        required: true,
        messages: { required: "Contact name is required" },
      });
      if (nameErrors.length) {
        contactErrors[`primary_contacts.${index}.name`] = nameErrors;
      }

      const emailErrors = [
        ...validateTextField(contact.email, {
          required: true,
          messages: { required: "Contact email is required" },
        }),
        ...validateEmail(contact.email, "Please enter a valid email address"),
      ];
      if (emailErrors.length) {
        contactErrors[`primary_contacts.${index}.email`] = emailErrors;
      }
    });

    const errors = createValidationErrors({ ...fieldErrors, ...contactErrors });
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
      await createVendor(formData).unwrap();
      router.push("/core-assets/vendors");
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
                New vendor
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Register a new vendor with risk assessment and contact information
              </p>
            </div>
            <Button
              type="submit"
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save new vendor"}
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
                          {field.replace(/_/g, " ").replace(/\./g, " ")}:
                        </span>{" "}
                        {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <VendorForm
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

export default CreateVendor;

