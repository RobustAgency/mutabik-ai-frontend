"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  stakeholderSchema,
  type StakeholderFormData,
} from "@/lib/schemas/stakeholder.schema";
import { useCreateStakeholderMutation } from "@/app/lib/features/stakeholdersApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ContactInformationStep } from "./steps/ContactInformationStep";
import { OrganizationDetailsStep } from "./steps/OrganizationDetailsStep";
import { RoleTagsStep } from "./steps/RoleTagsStep";
import { AdditionalInformationStep } from "./steps/AdditionalInformationStep";

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Type, name, and organization unit",
  },
  {
    id: 2,
    title: "Contact Information",
    description: "Email and phone",
  },
  {
    id: 3,
    title: "Organization Details",
    description: "Classification, country, and timezone",
  },
  {
    id: 4,
    title: "Role Tags",
    description: "Select stakeholder roles",
  },
  {
    id: 5,
    title: "Additional Information",
    description: "Status, dates, and optional fields",
  },
];

const initialFormData: StakeholderFormData = {
  type: "person",
  display_name: "",
  first_name: "",
  last_name: "",
  org_unit: "",
  email: "",
  secondary_email: null,
  phone: "",
  mobile: null,
  role_tags: [],
  timezone: "",
  classification: "internal",
  country: "",
  external_ref: null,
  employee_id: null,
  cost_center: null,
  manager: null,
  delegate: null,
  status: "active",
  notes: null,
  start_date: null,
  end_date: null,
};

export const CreateStakeholderWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createStakeholder, { isLoading }] = useCreateStakeholderMutation();

  const methods = useForm<StakeholderFormData>({
    resolver: zodResolver(stakeholderSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  // Validate specific step fields
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["type", "display_name", "first_name", "last_name", "org_unit"]);
      case 2:
        return await trigger(["email", "phone"]);
      case 3:
        return await trigger(["classification", "country", "timezone"]);
      case 4:
        return await trigger(["role_tags"]);
      case 5:
        return await trigger(["status"]);
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

  const handleFormSubmit = handleSubmit(async (data: StakeholderFormData) => {
    try {
      await createStakeholder(data).unwrap();
      router.push("/core-assets/stakeholders");
    } catch (error: any) {
      // Error handling is done in the mutation via toast
      console.error("Failed to create stakeholder:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <ContactInformationStep />;
      case 3:
        return <OrganizationDetailsStep />;
      case 4:
        return <RoleTagsStep />;
      case 5:
        return <AdditionalInformationStep />;
      default:
        return null;
    }
  };

  // Collect validation errors for display
  const validationErrors: Record<string, string[]> = {};
  Object.entries(errors).forEach(([key, error]) => {
    if (error?.message) {
      validationErrors[key] = [error.message as string];
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Stakeholder
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your stakeholder
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(validationErrors).map(([field, fieldErrors]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">
                        {field.replace(/_/g, " ")}:
                      </span>{" "}
                      {fieldErrors[0]}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Multi-Step Wizard */}
          <FormProvider {...methods}>
            <MultiStepWizard
              currentStep={currentStep}
              steps={WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create Stakeholder"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

