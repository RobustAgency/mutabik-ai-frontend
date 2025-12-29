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
  VendorRiskTier,
  VendorStatus,
  VendorType,
  DataProcessingRole,
} from "@/app/lib/features/vendorsApi";
import { vendorSchema, type VendorFormData } from "@/lib/schemas/vendor.schema";
import VendorForm from "./VendorForm";

const initialFormData: VendorFormData = {
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
  metadata: null,
};

const CreateVendor: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<VendorFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [createVendor, { isLoading }] = useCreateVendorMutation();

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
    const createData: CreateVendorData = {
      vendor_name: result.data.vendor_name,
      legal_name: result.data.legal_name,
      hq_country: result.data.hq_country,
      risk_tier: result.data.risk_tier as VendorRiskTier,
      status: result.data.status as VendorStatus,
      type: result.data.type as VendorType[],
      data_processing_role: result.data.data_processing_role as DataProcessingRole,
      service_provided: result.data.service_provided || null,
      primary_contacts: result.data.primary_contacts || [],
      metadata: result.data.metadata || null,
      duns_number: result.data.duns_number || null,
      lei_number: result.data.lei_number || null,
      tax_id: result.data.tax_id || null,
      stock_ticker: result.data.stock_ticker || null,
      notes: result.data.notes || null,
    };

    try {
      await createVendor(createData).unwrap();
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

