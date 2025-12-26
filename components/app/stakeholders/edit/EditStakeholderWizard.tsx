"use client";

import React, { useState, useEffect } from "react";
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
import {
  useGetStakeholderQuery,
  useUpdateStakeholderMutation,
  CreateStakeholderData,
} from "@/app/lib/features/stakeholdersApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { ContactInformationStep } from "../create/steps/ContactInformationStep";
import { OrganizationDetailsStep } from "../create/steps/OrganizationDetailsStep";
import { RoleTagsStep } from "../create/steps/RoleTagsStep";
import { AdditionalInformationStep } from "../create/steps/AdditionalInformationStep";

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

interface EditStakeholderWizardProps {
  stakeholderId: string;
}

const EditStakeholderWizard: React.FC<EditStakeholderWizardProps> = ({
  stakeholderId,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: stakeholder, isLoading: isLoadingStakeholder } =
    useGetStakeholderQuery(stakeholderId);
  const [updateStakeholder, { isLoading }] = useUpdateStakeholderMutation();

  const methods = useForm<StakeholderFormData>({
    resolver: zodResolver(stakeholderSchema) as any,
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
    if (stakeholder) {
      reset({
        type: stakeholder.type as StakeholderFormData["type"],
        display_name: stakeholder.display_name,
        first_name: stakeholder.first_name || "",
        last_name: stakeholder.last_name || "",
        org_unit: stakeholder.org_unit,
        email: stakeholder.email,
        secondary_email: stakeholder.secondary_email || null,
        phone: stakeholder.phone,
        mobile: stakeholder.mobile || null,
        role_tags: stakeholder.role_tags || [],
        timezone: stakeholder.timezone,
        classification: stakeholder.classification as "internal" | "external",
        country: stakeholder.country || "",
        external_ref: stakeholder.external_ref || null,
        employee_id: stakeholder.employee_id || null,
        cost_center: stakeholder.cost_center || null,
        manager: stakeholder.manager || null,
        delegate: stakeholder.delegate || null,
        status: stakeholder.status as StakeholderFormData["status"],
        notes: stakeholder.notes || null,
        start_date: stakeholder.start_date || null,
        end_date: stakeholder.end_date || null,
      });
    }
  }, [stakeholder, reset]);

  // Validate specific step fields
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger([
          "type",
          "display_name",
          "first_name",
          "last_name",
          "org_unit",
        ]);
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
      // Convert StakeholderFormData to CreateStakeholderData
      const updateData: CreateStakeholderData = {
        type: data.type,
        display_name: data.display_name,
        first_name: data.first_name,
        last_name: data.last_name,
        org_unit: data.org_unit,
        email: data.email,
        secondary_email: data.secondary_email || null,
        phone: data.phone,
        mobile: data.mobile || null,
        role_tags: data.role_tags,
        timezone: data.timezone,
        classification: data.classification,
        country: data.country,
        external_ref: data.external_ref || null,
        employee_id: data.employee_id || null,
        cost_center: data.cost_center || null,
        manager: data.manager || null,
        delegate: data.delegate || null,
        status: data.status,
        notes: data.notes || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
      };
      await updateStakeholder({
        id: stakeholderId,
        data: updateData,
      }).unwrap();
      router.push("/core-assets/stakeholders");
    } catch (error: any) {
      console.error("Failed to update stakeholder:", error);
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

  if (isLoadingStakeholder) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading stakeholder details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stakeholder) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Stakeholder not found</p>
            <button
              type="button"
              onClick={() => router.push("/core-assets/stakeholders")}
              className="bg-[#4FD58F] text-white px-4 py-2 rounded"
            >
              Back to Stakeholders
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Edit Stakeholder
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to update your stakeholder
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
              submitLabel="Update Stakeholder"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditStakeholderWizard;

