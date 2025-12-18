"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";
import type { RecordOfProcessingActivityFormData } from "@/lib/schemas/recordOfProcessingActivity.schema";

const dataSubjectCategoryOptions = [
  { value: "customers", label: "Customers" },
  { value: "employees", label: "Employees" },
  { value: "prospects", label: "Prospects" },
  { value: "vendors", label: "Vendors" },
  { value: "students", label: "Students" },
  { value: "children", label: "Children" },
  { value: "patients", label: "Patients" },
];

const dataCategoryOptions = [
  { value: "name", label: "Name" },
  { value: "contact", label: "Contact" },
  { value: "identifier", label: "Identifier" },
  { value: "financial", label: "Financial" },
  { value: "health", label: "Health" },
  { value: "biometric", label: "Biometric" },
  { value: "behavioral", label: "Behavioral" },
  { value: "sensitive", label: "Sensitive" },
  { value: "children", label: "Children" },
  { value: "location", label: "Location" },
];

export const DataCategoriesStep: React.FC = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RecordOfProcessingActivityFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data_subject_categories">
            Data Subject Categories <span className="text-red-500">*</span>
          </Label>
          <CustomMultiSelect
            options={dataSubjectCategoryOptions}
            value={watch("data_subject_categories") || []}
            onChange={(value) => setValue("data_subject_categories", value as any)}
            placeholder="Select data subject categories"
            className={`w-full ${errors.data_subject_categories ? "border-red-500" : ""}`}
          />
          {errors.data_subject_categories && (
            <p className="text-sm text-red-500">
              {errors.data_subject_categories.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_categories">
            Data Categories <span className="text-red-500">*</span>
          </Label>
          <CustomMultiSelect
            options={dataCategoryOptions}
            value={watch("data_categories") || []}
            onChange={(value) => setValue("data_categories", value as any)}
            placeholder="Select data categories"
            className={`w-full ${errors.data_categories ? "border-red-500" : ""}`}
          />
          {errors.data_categories && (
            <p className="text-sm text-red-500">{errors.data_categories.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 flex items-center gap-2">
        <Checkbox
          id="contains_pii"
          checked={watch("contains_pii") || false}
          onCheckedChange={(checked) => setValue("contains_pii", checked === true)}
        />
        <Label 
          htmlFor="contains_pii" 
          className="cursor-pointer"
          onClick={() => setValue("contains_pii", !watch("contains_pii"))}
        >
          Contains PII
        </Label>
      </div>
    </div>
  );
};

