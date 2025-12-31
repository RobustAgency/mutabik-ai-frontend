"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  useCreateDatasetMutation, 
  CreateDatasetData,
  Purpose,
  OwnerTeam,
  DataSteward,
  Status,
  ContainPersonalData,
  Sensitivity,
  CrossBorderTransfer,
} from "@/app/lib/features/datasetsApi";
import DatasetForm from "./DatasetForm";

const initialFormData: CreateDatasetData = {
  name: "",
  description: null,
  purpose: Purpose.AI_ML_TRAINING,
  owner_team: OwnerTeam.DATA_ENGINEERING_TEAM,
  data_steward: DataSteward.DATA_ENGINEER,
  source_ids: [],
  status: Status.DRAFT,
  estimated_row_count: null,
  estimated_size: null,
  size_unit: null,
  retention_period: null,
  primary_languages: null,
  contains_personal_data: ContainPersonalData.UNKNOWN,
  sensitivity: Sensitivity.INTERNAL,
  cross_border_transfer: CrossBorderTransfer.NONE,
  license_type: null,
};

interface DatasetModalFormProps {
  onSuccess?: (dataset: any) => void;
  onCancel?: () => void;
}

const DatasetModalForm: React.FC<DatasetModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateDatasetData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [createDataset, { isLoading }] = useCreateDatasetMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationErrors({});

    try {
      const result = await createDataset(formData).unwrap();

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

      <DatasetForm
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
          {isLoading ? "Creating..." : "Create Dataset"}
        </Button>
      </div>
    </form>
  );
};

export default DatasetModalForm;
