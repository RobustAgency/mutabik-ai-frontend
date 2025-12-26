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
  VendorRiskTier,
  VendorStatus,
  VendorType,
  DataProcessingRole,
} from "@/app/lib/features/vendorsApi";
import { vendorSchema, type VendorFormData } from "@/lib/schemas/vendor.schema";
import VendorForm from "../create/VendorForm";

interface EditVendorProps {
  vendorId: number;
}

const EditVendor: React.FC<EditVendorProps> = ({ vendorId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<VendorFormData>({
    vendor_name: "",
    legal_name: "",
    hq_country: "",
    risk_tier: "" as any, // Start empty to trigger validation
    status: "" as any, // Start empty to trigger validation
    type: [],
    data_processing_role: "" as any, // Start empty to trigger validation
    service_provided: null,
    primary_contacts: [],
    duns_number: null,
    lei_number: null,
    tax_id: null,
    stock_ticker: null,
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
        risk_tier: vendor.risk_tier as any,
        status: vendor.status as any,
        type: vendor.type || [],
        data_processing_role: vendor.data_processing_role as any,
        service_provided: vendor.service_provided || null,
        primary_contacts: (vendor.primary_contacts || []).map(contact => ({
          name: contact.name,
          email: contact.email,
          phone: contact.phone ?? null,
          role: contact.role ?? null,
          primary: contact.primary ?? null,
        })),
        duns_number: vendor.duns_number || null,
        lei_number: vendor.lei_number || null,
        tax_id: vendor.tax_id || null,
        stock_ticker: vendor.stock_ticker || null,
        notes: vendor.notes || null,
      });
    }
  }, [vendor]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate using Zod schema
    const result = vendorSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = [err.message];
      });
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Convert VendorFormData to CreateVendorData
    const updateData: CreateVendorData = {
      vendor_name: result.data.vendor_name,
      legal_name: result.data.legal_name,
      hq_country: result.data.hq_country,
      risk_tier: result.data.risk_tier as VendorRiskTier,
      status: result.data.status as VendorStatus,
      type: result.data.type as VendorType[],
      data_processing_role: result.data.data_processing_role as DataProcessingRole,
      service_provided: result.data.service_provided || null,
      primary_contacts: result.data.primary_contacts || [],
      duns_number: result.data.duns_number || null,
      lei_number: result.data.lei_number || null,
      tax_id: result.data.tax_id || null,
      stock_ticker: result.data.stock_ticker || null,
      notes: result.data.notes || null,
    };

    try {
      await updateVendor({
        id: vendorId,
        data: updateData,
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

