"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { dataSourceSchema, type DataSourceFormData } from "@/lib/schemas/dataSource.schema";
import {
  useGetDataSourceQuery,
  useUpdateDataSourceMutation,
  CreateDataSourceData,
  SystemType,
  OwnerTeam,
  DataDomain,
  DataResidency,
  CriticalityLevel,
  HostingModel,
  DataSourceStatus,
} from "@/app/lib/features/dataSourcesApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { ClassificationStep } from "../create/steps/ClassificationStep";
import { OwnershipStep } from "../create/steps/OwnershipStep";
import { ReviewDatesStep } from "../create/steps/ReviewDatesStep";

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Essential Information",
    description: "Source name, description, system type, owner team, and data domains",
  },
  {
    id: 2,
    title: "Location & Classification",
    description: "Data residency, criticality level, and hosting model",
  },
  {
    id: 3,
    title: "Ownership",
    description: "Technical owner and business owner",
  },
  {
    id: 4,
    title: "Review Schedule",
    description: "Review dates and status",
  },
];

interface EditDataSourceWizardProps {
  dataSourceId: number;
}

const EditDataSourceWizard: React.FC<EditDataSourceWizardProps> = ({ dataSourceId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: dataSource, isLoading: isLoadingDataSource } = useGetDataSourceQuery(dataSourceId);
  const [updateDataSource, { isLoading }] = useUpdateDataSourceMutation();

  const methods = useForm<DataSourceFormData>({
    resolver: zodResolver(dataSourceSchema) as any,
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
    if (dataSource) {
      reset({
        name: dataSource.name,
        description: dataSource.description || "",
        system_type: dataSource.system_type,
        owner_team: dataSource.owner_team,
        data_domains: dataSource.data_domains || [],
        residency: dataSource.residency,
        criticality_level: dataSource.criticality_level || null,
        hosting_model: dataSource.hosting_model,
        technical_owner: dataSource.technical_owner,
        business_owner: dataSource.business_owner,
        last_review_date: dataSource.last_review_date || null,
        next_review_date: dataSource.next_review_date || null,
        status: dataSource.status ?? DataSourceStatus.DRAFT,
      });
    }
  }, [dataSource, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["name", "description", "system_type", "owner_team"]);
      case 2:
        return await trigger(["residency", "hosting_model"]);
      case 3:
        return await trigger(["technical_owner", "business_owner"]);
      case 4:
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

  const handleFormSubmit = handleSubmit(async (data: DataSourceFormData) => {
    try {
      // Convert DataSourceFormData to CreateDataSourceData
      const updateData: CreateDataSourceData = {
        name: data.name,
        description: data.description,
        system_type: data.system_type,
        owner_team: data.owner_team,
        data_domains: data.data_domains,
        residency: data.residency,
        criticality_level: data.criticality_level || null,
        hosting_model: data.hosting_model,
        technical_owner: data.technical_owner,
        business_owner: data.business_owner,
        last_review_date: data.last_review_date || null,
        next_review_date: data.next_review_date || null,
        status: data.status,
      };
      await updateDataSource({
        id: dataSourceId,
        data: updateData,
      }).unwrap();
      router.push("/core-assets/data/sources");
    } catch (error: any) {
      console.error("Failed to update data source:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <ClassificationStep />;
      case 3:
        return <OwnershipStep />;
      case 4:
        return <ReviewDatesStep />;
      default:
        return null;
    }
  };

  if (isLoadingDataSource) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading data source details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dataSource) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Data source not found</p>
            <button
              onClick={() => router.push("/core-assets/data/sources")}
              className="bg-[#4FD58F] text-white px-4 py-2 rounded"
            >
              Back to Data Sources
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
            Edit Data Source
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to update your data source
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
              submitLabel="Update Data Source"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDataSourceWizard;

