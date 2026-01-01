"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { dataElementSchema, type DataElementFormData } from "@/lib/schemas/dataElement.schema";
import {
  useCreateDataElementMutation,
  CreateDataElementData,
  DataType,
  Sensitivity,
  PiiFlag,
  SpecialCategoryFlag,
  CdeFlag,
} from "@/app/lib/features/dataElementsApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { PhysicalLocationStep } from "./steps/PhysicalLocationStep";
import { TechnicalDetailsStep } from "./steps/TechnicalDetailsStep";
import { ClassificationStep } from "./steps/ClassificationStep";
import { CdeReferencesStep } from "./steps/CdeReferencesStep";

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Element name, data type, format, business definition, data steward, and status",
  },
  {
    id: 2,
    title: "Physical Location & Lineage",
    description: "Data source, database, schema, table, column, and datasets using this element",
  },
  {
    id: 3,
    title: "Technical Details",
    description: "Nullable, unique, default value, sample values, and validation rules",
  },
  {
    id: 4,
    title: "Classification",
    description: "Sensitivity level and contains personal data",
  },
  {
    id: 5,
    title: "Critical Data Element (CDE)",
    description: "CDE flag and categories",
  },
];

const initialFormData: Partial<DataElementFormData> = {
  name: "",
  business_definition: null,
  data_type: DataType.STRING,
  format: null,
  sensitivity: Sensitivity.INTERNAL,
  pii_flag: PiiFlag.NO,
  special_category_flag: SpecialCategoryFlag.NO,
  cde_flag: CdeFlag.NO,
  cde_category: null,
  owner_team: null,
  quality_rules_ref: null,
  catalog_column_id: null,
};

const CreateDataElementWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createDataElement, { isLoading }] = useCreateDataElementMutation();

  const methods = useForm<DataElementFormData>({
    resolver: zodResolver(dataElementSchema) as any,
    defaultValues: initialFormData as DataElementFormData,
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
        return await trigger(["name", "data_type"]);
      case 2:
        // Physical location fields are UI-only for now, skip validation
        return true;
      case 3:
        // Technical details fields are UI-only for now, skip validation
        return true;
      case 4:
        return await trigger(["sensitivity", "pii_flag"]);
      case 5:
        return await trigger(["cde_flag", "cde_category"]);
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

  const handleFormSubmit = handleSubmit(async (data: DataElementFormData) => {
    try {
      // Convert DataElementFormData to CreateDataElementData
      // Note: UI-only fields (physical location, technical details, data_steward, status) are not submitted
      const createData: CreateDataElementData = {
        name: data.name,
        business_definition: data.business_definition || null,
        data_type: data.data_type,
        format: data.format || null,
        sensitivity: data.sensitivity,
        pii_flag: data.pii_flag,
        personal_data_category: data.personal_data_category || null,
        special_category_flag: data.special_category_flag,
        cde_flag: data.cde_flag,
        cde_category: data.cde_category || null,
        owner_team: data.owner_team || null,
        quality_rules_ref: data.quality_rules_ref || null,
        catalog_column_id: data.catalog_column_id || null,
      };
      await createDataElement(createData).unwrap();
      router.push("/core-assets/data/elements");
    } catch (error: any) {
      console.error("Failed to create data element:", error);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Data Element
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your data element
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
              submitLabel="Create Data Element"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDataElementWizard;
