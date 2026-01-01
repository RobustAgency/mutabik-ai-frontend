"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { DataElementFormData } from "@/lib/schemas/dataElement.schema";
import {
  DataType,
} from "@/app/lib/features/dataElementsApi";
import { DataSteward, Status } from "@/app/lib/features/datasetsApi";

const DATA_TYPE_OPTIONS = [
  { value: DataType.STRING, label: "String" },
  { value: DataType.INTEGER, label: "Integer" },
  { value: DataType.DECIMAL, label: "Decimal" },
  { value: DataType.BOOLEAN, label: "Boolean" },
  { value: DataType.DATE, label: "Date" },
  { value: DataType.DATETIME, label: "DateTime" },
  { value: DataType.TIMESTAMP, label: "Timestamp" },
  { value: DataType.JSON, label: "JSON" },
  { value: DataType.BINARY, label: "Binary" },
  { value: DataType.ARRAY, label: "Array" },
  { value: DataType.OTHER, label: "Other" },
];

const DATA_STEWARD_OPTIONS = [
  { value: DataSteward.DATA_ENGINEER, label: "Data Engineer" },
  { value: DataSteward.DATA_SCIENTIST, label: "Data Scientist" },
  { value: DataSteward.ML_ENGINEER, label: "ML Engineer" },
  { value: DataSteward.PRIVACY_OFFICER, label: "Privacy Officer" },
  { value: DataSteward.COMPLIANCE_OFFICER, label: "Compliance Officer" },
];

const STATUS_OPTIONS = [
  { value: Status.DRAFT, label: "Draft" },
  { value: Status.ACTIVE, label: "Active" },
  { value: Status.UNDER_REVIEW, label: "Under Review" },
  { value: Status.DEPRECATED, label: "Deprecated" },
  { value: Status.ARCHIVED, label: "Archived" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const name = watch("name");
  const businessDefinition = watch("business_definition");
  const dataType = watch("data_type");
  const format = watch("format");
  const dataSteward = watch("data_steward" as any);
  const status = watch("status" as any);

  const hasError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information <span className="text-red-500">*</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Element Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Element Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., customer_email"
              className={`w-full ${hasError("name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("name") && (
              <p className="text-sm text-red-500">{getError("name")}</p>
            )}
          </div>

          {/* Data Type */}
          <div className="space-y-2">
            <Label htmlFor="data_type">
              Data Type <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`data_type-${dataType || "none"}`}
              value={dataType || ""}
              onValueChange={(value) =>
                setValue("data_type", value as DataType, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("data_type") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("data_type") && (
              <p className="text-sm text-red-500">{getError("data_type")}</p>
            )}
          </div>

          {/* Format/Pattern */}
          <div className="space-y-2">
            <Label htmlFor="format">Format/Pattern</Label>
            <Input
              id="format"
              {...register("format")}
              placeholder="e.g., email, UUID, ISO8601"
              className="w-full"
            />
          </div>

          {/* Data Steward */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="data_steward">
                Data Steward <span className="text-red-500">*</span>
              </Label>
              {/* <Link
                href="/core-assets/stakeholders"
                className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
              >
                Manage
                <ExternalLink className="h-3 w-3" />
              </Link> */}
            </div>
            <Select
              key={`data_steward-${dataSteward || "none"}`}
              value={dataSteward || ""}
              onValueChange={(value) =>
                setValue("data_steward" as any, value as DataSteward, {
                  shouldValidate: false,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {DATA_STEWARD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`status-${status || "none"}`}
              value={status || Status.ACTIVE}
              onValueChange={(value) =>
                setValue("status" as any, value as Status, {
                  shouldValidate: false,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business Definition */}
        <div className="space-y-2">
          <Label htmlFor="business_definition">Business Definition</Label>
          <Textarea
            id="business_definition"
            {...register("business_definition")}
            placeholder="Clear business description of this data element..."
            className="min-h-32 resize-none w-full"
          />
        </div>
      </div>
    </div>
  );
};
