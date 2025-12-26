"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle } from "lucide-react";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

const VENDOR_TYPE_OPTIONS = [
  { value: "model_provider", label: "Model Provider" },
  { value: "dataset_provider", label: "Dataset Provider" },
  { value: "infrastructure_cloud", label: "Infrastructure/Cloud" },
  { value: "saas_platform", label: "SaaS Platform" },
  { value: "consulting_services", label: "Consulting/Services" },
  { value: "hardware_provider", label: "Hardware Provider" },
  { value: "api_service", label: "API Service" },
  { value: "annotation_labeling", label: "Annotation/Labeling" },
  { value: "other", label: "Other" },
];

const DATA_PROCESSING_ROLE_OPTIONS = [
  { value: "controller", label: "Controller" },
  { value: "processor", label: "Processor" },
  { value: "sub_processor", label: "Sub-processor" },
  { value: "not_applicable", label: "Not Applicable" },
];

export const ClassificationStatusStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  const types = watch("type") || [];
  const dataProcessingRole = watch("data_processing_role");
  const serviceProvided = watch("service_provided");

  const handleTypeToggle = (typeValue: string) => {
    const newTypes = types.includes(typeValue as any)
      ? types.filter((t) => t !== typeValue)
      : [...types, typeValue as any];
    setValue("type", newTypes as any, { shouldValidate: true });
  };

  const removeType = (typeValue: string) => {
    setValue(
      "type",
      types.filter((t) => t !== typeValue) as any,
      { shouldValidate: true }
    );
  };

  const getTypeLabel = (value: string): string => {
    const type = VENDOR_TYPE_OPTIONS.find((t) => t.value === value);
    return type ? type.label : value;
  };

  const hasError = (fieldName: keyof VendorFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof VendorFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 2: Vendor Classification
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-6">
        {/* Vendor Type */}
        <div className="space-y-2">
          <Label htmlFor="type">
            Vendor Type <span className="text-red-500">*</span>
          </Label>
          {hasError("type") && (
            <p className="text-sm text-red-500">{getError("type")}</p>
          )}
          <p className="text-xs text-gray-500 mb-3">
            Select all that apply
          </p>

          <div className="grid grid-cols-3 gap-2 border border-gray-200 rounded-lg p-3">
            {VENDOR_TYPE_OPTIONS.map((type) => {
              const isSelected = types.includes(type.value as any);
              return (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 text-sm p-2 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                    isSelected
                      ? "bg-green-50 border-[#039855]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    checked={isSelected}
                    onChange={() => handleTypeToggle(type.value)}
                  />
                  <span className={isSelected ? "text-[#039855] font-medium" : ""}>
                    {type.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Selected Types Display */}
          {types.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected types ({types.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {types.map((typeValue) => (
                  <Badge
                    key={typeValue}
                    variant="light"
                    color="success"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {getTypeLabel(typeValue)}
                    <button
                      type="button"
                      onClick={() => removeType(typeValue)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data Processing Role */}
        <div className="space-y-2">
          <Label htmlFor="data_processing_role">
            Data Processing Role <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`data_processing_role-select-${dataProcessingRole || "none"}-${Date.now()}`}
            value={dataProcessingRole || ""}
            onValueChange={(value) =>
              setValue("data_processing_role", value as any, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`w-full ${hasError("data_processing_role") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select data processing role" />
            </SelectTrigger>
            <SelectContent>
              {DATA_PROCESSING_ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("data_processing_role") && (
            <p className="text-sm text-red-500">{getError("data_processing_role")}</p>
          )}
        </div>

        {/* Service Provided */}
        <div className="space-y-2">
          <Label htmlFor="service_provided">Services Provided</Label>
          <Input
            id="service_provided"
            {...register("service_provided")}
            className={hasError("service_provided") ? "border-red-500" : ""}
            placeholder="e.g., LLM API, Data hosting"
          />
          {hasError("service_provided") && (
            <p className="text-sm text-red-500">{getError("service_provided")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

