"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  useCreateDataSourceMutation, 
  CreateDataSourceData,
  SystemType,
  OwnerTeam,
  DataResidency,
  HostingModel,
  DataSourceStatus,
} from "@/app/lib/features/dataSourcesApi";
import DataSourceForm from "./DataSourceForm";

const initialFormData: CreateDataSourceData = {
  name: "",
  description: "",
  system_type: SystemType.APPLICATION_DB,
  owner_team: OwnerTeam.DATA_ENGINEERING_TEAM,
  data_domains: [],
  residency: DataResidency.US,
  criticality_level: null,
  hosting_model: HostingModel.CLOUD,
  technical_owner: OwnerTeam.DATA_ENGINEERING_TEAM,
  business_owner: OwnerTeam.DATA_ENGINEERING_TEAM,
  last_review_date: null,
  next_review_date: null,
  status: DataSourceStatus.DRAFT,
};

interface DataSourceModalFormProps {
  onSuccess?: (dataSource: any) => void;
  onCancel?: () => void;
}

const DataSourceModalForm: React.FC<DataSourceModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateDataSourceData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [createDataSource, { isLoading }] = useCreateDataSourceMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationErrors({});

    try {
      const result = await createDataSource(formData).unwrap();

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(validationErrors).map(([field, errors]) => (
                <li key={field}>
                  <span className="font-medium capitalize">
                    {field.replace(/_/g, " ")}:
                  </span>{" "}
                  {errors[0]}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <DataSourceForm
        formData={formData}
        setFormData={setFormData}
        errors={validationErrors}
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#4FD58F] hover:bg-[#3fc77f]"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Data Source"}
        </Button>
      </div>
    </form>
  );
};

export default DataSourceModalForm;
