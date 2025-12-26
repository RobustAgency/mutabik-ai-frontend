"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { vendorSchema, type VendorFormData } from "@/lib/schemas/vendor.schema";
import {
  useGetVendorQuery,
  useUpdateVendorMutation,
  CreateVendorData,
  VendorRiskTier,
  VendorStatus,
  VendorType,
  DataProcessingRole,
} from "@/app/lib/features/vendorsApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { ClassificationStatusStep } from "../create/steps/ClassificationStatusStep";
import { PrimaryContactsStep } from "../create/steps/PrimaryContactsStep";
import { ServiceDetailsStep } from "../create/steps/ServiceDetailsStep";

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Vendor name, legal name, HQ country, risk tier, and status",
  },
  {
    id: 2,
    title: "Vendor Classification",
    description: "Type, data processing role, and services provided",
  },
  {
    id: 3,
    title: "Primary Contacts",
    description: "Contact information for vendor representatives",
  },
  {
    id: 4,
    title: "Additional Information",
    description: "Notes and advanced options (DUNS, LEI, tax ID, stock ticker)",
  },
];

interface EditVendorWizardProps {
  vendorId: number;
}

const EditVendorWizard: React.FC<EditVendorWizardProps> = ({ vendorId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: vendor, isLoading: isLoadingVendor } = useGetVendorQuery(vendorId);
  const [updateVendor, { isLoading }] = useUpdateVendorMutation();

  const methods = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema) as any,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  // Populate form with existing data
  useEffect(() => {
    if (vendor) {
      reset({
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
  }, [vendor, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["vendor_name", "legal_name", "hq_country", "risk_tier", "status"]);
      case 2:
        return await trigger(["type", "data_processing_role"]);
      case 3:
        // Primary contacts is optional per backend, so skip validation if empty
        return true;
      case 4:
        return true; // All fields are optional in this step
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: VendorFormData) => {
    try {
      // Convert VendorFormData to CreateVendorData
      const updateData: CreateVendorData = {
        vendor_name: data.vendor_name,
        legal_name: data.legal_name,
        hq_country: data.hq_country,
        risk_tier: data.risk_tier as VendorRiskTier,
        status: data.status as VendorStatus,
        type: data.type as VendorType[],
        data_processing_role: data.data_processing_role as DataProcessingRole,
        service_provided: data.service_provided || null,
        primary_contacts: data.primary_contacts || [],
        duns_number: data.duns_number || null,
        lei_number: data.lei_number || null,
        tax_id: data.tax_id || null,
        stock_ticker: data.stock_ticker || null,
        notes: data.notes || null,
      };
      await updateVendor({
        id: vendorId,
        data: updateData,
      }).unwrap();
      router.push("/core-assets/vendors");
    } catch (error: any) {
      console.error("Failed to update vendor:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <ClassificationStatusStep />;
      case 3:
        return <PrimaryContactsStep />;
      case 4:
        return <ServiceDetailsStep />;
      default:
        return null;
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
            <button
              onClick={() => router.push("/core-assets/vendors")}
              className="bg-[#4FD58F] text-white px-4 py-2 rounded"
            >
              Back to Vendors
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Vendor
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to update your vendor
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => {
                    const errorMessage = error?.message as string;
                    if (!errorMessage) return null;
                    return (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errorMessage}
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <FormProvider {...methods}>
            <MultiStepWizard
              currentStep={currentStep}
              steps={WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Update Vendor"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVendorWizard;

