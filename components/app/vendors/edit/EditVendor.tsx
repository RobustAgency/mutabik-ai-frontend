"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetVendorQuery,
  useUpdateVendorMutation,
  CreateVendorData,
} from "@/app/lib/features/vendorsApi";
import {
  validateTextField,
  validateEmail,
  validateArrayField,
  createValidationErrors,
} from "@/lib/utils/validation";
import VendorForm from "../create/VendorForm";

interface EditVendorProps {
  vendorId: number;
}

const EditVendor: React.FC<EditVendorProps> = ({ vendorId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateVendorData>({
    vendor_name: "",
    legal_name: "",
    hq_country: "",
    risk_tier: "tier_1",
    status: "evaluating",
    stakeholder_id: null,
    primary_contacts: [],
    metadata: {},
    notes: null,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const { data: vendor, isLoading: isLoadingVendor } = useGetVendorQuery(vendorId);
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();

  // Populate form with existing data
  useEffect(() => {
    if (vendor) {
      setFormData({
        vendor_name: vendor.vendor_name,
        legal_name: vendor.legal_name,
        hq_country: vendor.hq_country,
        risk_tier: vendor.risk_tier,
        status: vendor.status,
        stakeholder_id: vendor.stakeholder_id,
        primary_contacts: vendor.primary_contacts || [],
        metadata: vendor.metadata || {},
        notes: vendor.notes,
      });
    }
  }, [vendor]);

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
      primary_contacts: validateArrayField(formData.primary_contacts, {
        required: false,
      }),
    };

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
      await updateVendor({
        id: vendorId,
        data: formData,
      }).unwrap();
      router.push("/core-assets/vendors");
    } catch (err: any) {
      // Handle backend validation errors
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoadingVendor) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading vendor details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Vendor not found</p>
            <Button
              onClick={() => router.push("/core-assets/vendors")}
              className="bg-[#4FD58F] text-white"
            >
              Back to Vendors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSave}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Edit vendor
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Update vendor registry information
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/core-assets/vendors")}>Cancel</Button>
              <Button type="submit" className="border bg-[#4FD58F] opacity-100" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save changes"}</Button>
            </div>
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

export default EditVendor;

