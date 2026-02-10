"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { dataElementSchema, type DataElementFormData } from "@/lib/schemas/dataElement.schema";
import {
  useGetDataElementQuery,
  useUpdateDataElementMutation,
  CreateDataElementData,
} from "@/app/lib/features/dataElementsApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { PhysicalLocationStep } from "../create/steps/PhysicalLocationStep";
import { TechnicalDetailsStep } from "../create/steps/TechnicalDetailsStep";
import { ClassificationStep } from "../create/steps/ClassificationStep";
import { CdeReferencesStep } from "../create/steps/CdeReferencesStep";
import { DATA_ELEMENT_WIZARD_STEPS } from "../constants";

interface EditDataElementWizardProps {
  elementId: number;
}

const EditDataElementWizard: React.FC<EditDataElementWizardProps> = ({ elementId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: element, isLoading: isLoadingElement } = useGetDataElementQuery(elementId);
  const [updateDataElement, { isLoading }] = useUpdateDataElementMutation();

  const methods = useForm<DataElementFormData>({
    resolver: zodResolver(dataElementSchema) as any,
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
    if (element) {
      reset({
        name: element.name,
        data_type: element.data_type,
        format: element.format || null,
        business_definition: element.business_definition || "",
        data_steward: element.data_steward,
        status: element.status,
        data_source_id: element.data_source_id,
        database_name: element.database_name,
        schema_name: element.schema_name || null,
        table_name: element.table_name,
        column_name: element.column_name,
        used_in_datasets: element.used_in_datasets || null,
        is_nullable: element.is_nullable !== null && element.is_nullable !== undefined ? element.is_nullable : null,
        is_unique: element.is_unique !== null && element.is_unique !== undefined ? element.is_unique : null,
        default_value: element.default_value || null,
        validation_rule: element.validation_rule || null,
        sample_values: element.sample_values || null,
        sensitivity: element.sensitivity,
        contains_personal_data: element.contains_personal_data,
        personal_data_type: element.personal_data_type || null,
        contains_sensitive_data: element.contains_sensitive_data || null,
        default_masking_method: element.default_masking_method || null,
        cde_flag: element.cde_flag || false,
        cde_categories: element.cde_categories || [],
      });
    }
  }, [element, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["name", "data_type", "business_definition", "data_steward", "status"]);
      case 2:
        return await trigger(["data_source_id", "database_name", "table_name", "column_name"]);
      case 3:
        return true; // Technical details are optional
      case 4:
        return await trigger(["sensitivity", "contains_personal_data"]);
      case 5:
        return await trigger(["cde_flag", "cde_categories"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, DATA_ELEMENT_WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: DataElementFormData) => {
    try {
      // Build base data object, conditionally including optional fields
      const baseData: any = {
        name: data.name,
        data_type: data.data_type,
        format: data.format || null,
        business_definition: data.business_definition,
        data_steward: data.data_steward,
        status: data.status,
        data_source_id: data.data_source_id,
        database_name: data.database_name,
        schema_name: data.schema_name || null,
        table_name: data.table_name,
        column_name: data.column_name,
        used_in_datasets: data.used_in_datasets || null,
        default_value: data.default_value || null,
        validation_rule: data.validation_rule || null,
        sample_values: data.sample_values || null,
        sensitivity: data.sensitivity,
        contains_personal_data: data.contains_personal_data, // Schema enforces 0 | 1
        default_masking_method: data.default_masking_method || null,
        cde_categories: data.cde_categories,
      };

      // Only include is_nullable if it's explicitly set (not null/undefined)
      if (data.is_nullable !== null && data.is_nullable !== undefined) {
        baseData.is_nullable = data.is_nullable;
      }

      // Only include is_unique if it's explicitly set (not null/undefined)
      if (data.is_unique !== null && data.is_unique !== undefined) {
        baseData.is_unique = data.is_unique;
      }

      // Only include cde_flag if it's explicitly set (not null/undefined)
      // When "No" is selected, it should be false, not null
      if (data.cde_flag !== null && data.cde_flag !== undefined) {
        baseData.cde_flag = data.cde_flag;
      }

      // Only include personal_data_type and contains_sensitive_data if contains_personal_data is 1
      const updateData: CreateDataElementData = data.contains_personal_data === 1
        ? {
            ...baseData,
            personal_data_type: data.personal_data_type || null,
            contains_sensitive_data: data.contains_sensitive_data ?? 0,
          }
        : baseData as CreateDataElementData;

      await updateDataElement({
        id: elementId,
        data: updateData,
      }).unwrap();
      router.push("/core-assets/data/elements");
    } catch (error: any) {
      console.error("Failed to update data element:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <PhysicalLocationStep />;
      case 3:
        return <TechnicalDetailsStep />;
      case 4:
        return <ClassificationStep />;
      case 5:
        return <CdeReferencesStep />;
      default:
        return null;
    }
  };

  if (isLoadingElement) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading data element...</p>
        </Card>
      </div>
    );
  }

  if (!element) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Data element not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Data Element
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update data element information
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
              steps={DATA_ELEMENT_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Update Data Element"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDataElementWizard;
