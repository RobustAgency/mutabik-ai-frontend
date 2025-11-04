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

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields
    if (!formData.vendor_name?.trim()) {
      errors.vendor_name = ["Vendor name is required"];
    }

    if (!formData.legal_name?.trim()) {
      errors.legal_name = ["Legal name is required"];
    }

    if (!formData.hq_country?.trim()) {
      errors.hq_country = ["HQ country is required"];
    }

    if (!formData.risk_tier) {
      errors.risk_tier = ["Risk tier is required"];
    }

    if (!formData.status) {
      errors.status = ["Status is required"];
    }

    // Validate primary contacts if any
    if (formData.primary_contacts.length > 0) {
      formData.primary_contacts.forEach((contact, index) => {
        if (!contact.name?.trim()) {
          errors[`primary_contacts.${index}.name`] = [
            "Contact name is required",
          ];
        }
        if (!contact.email?.trim()) {
          errors[`primary_contacts.${index}.email`] = [
            "Contact email is required",
          ];
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (contact.email && !emailRegex.test(contact.email)) {
          errors[`primary_contacts.${index}.email`] = [
            "Please enter a valid email address",
          ];
        }
      });
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
            <Button
              type="submit"
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save changes"}
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

export default EditVendor;

