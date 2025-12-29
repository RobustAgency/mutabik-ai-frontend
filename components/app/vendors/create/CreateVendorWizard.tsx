"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { vendorSchema, type VendorFormData } from "@/lib/schemas/vendor.schema";
import { 
  useCreateVendorMutation,
  CreateVendorData,
  VendorRiskTier,
  VendorStatus,
  VendorType,
  DataProcessingRole,
} from "@/app/lib/features/vendorsApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ClassificationStatusStep } from "./steps/ClassificationStatusStep";
import { PrimaryContactsStep } from "./steps/PrimaryContactsStep";
import { ServiceDetailsStep } from "./steps/ServiceDetailsStep";
import { MetadataStep } from "./steps/MetadataStep";

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
    title: "Metadata",
    description: "Sub-processors URL, residency options, websites, parent company, and metadata notes",
  },
  {
    id: 5,
    title: "Additional Information",
    description: "Notes and advanced options (DUNS, LEI, tax ID, stock ticker)",
  },
];

const initialFormData: VendorFormData = {
  vendor_name: "",
  legal_name: "",
  hq_country: "",
  risk_tier: "" as any, // Start empty to trigger validation
  status: "" as any, // Start empty to trigger validation
  type: [],
  data_processing_role: "not_applicable",
  service_provided: null,
  primary_contacts: [],
  duns_number: null,
  lei_number: null,
  tax_id: null,
  stock_ticker: null,
  notes: null,
  metadata: null,
};

const CreateVendorWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createVendor, { isLoading }] = useCreateVendorMutation();

  const methods = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

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
        return true; // All metadata fields are optional
      case 5:
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
      const createData: CreateVendorData = {
        vendor_name: data.vendor_name,
        legal_name: data.legal_name,
        hq_country: data.hq_country,
        risk_tier: data.risk_tier as VendorRiskTier,
        status: data.status as VendorStatus,
        type: data.type as VendorType[],
        data_processing_role: data.data_processing_role as DataProcessingRole,
        service_provided: data.service_provided || null,
        primary_contacts: data.primary_contacts || [],
        metadata: data.metadata || null,
        duns_number: data.duns_number || null,
        lei_number: data.lei_number || null,
        tax_id: data.tax_id || null,
        stock_ticker: data.stock_ticker || null,
        notes: data.notes || null,
      };
      await createVendor(createData).unwrap();
      router.push("/core-assets/vendors");
    } catch (error: any) {
      console.error("Failed to create vendor:", error);
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
        return <MetadataStep />;
      case 5:
        return <ServiceDetailsStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Vendor
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your vendor
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
              submitLabel="Create Vendor"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVendorWizard;

