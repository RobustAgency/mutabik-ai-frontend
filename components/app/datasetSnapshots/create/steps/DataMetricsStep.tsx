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
import type { DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";
import { FileFormat } from "@/app/lib/features/datasetSnapshotsApi";
import { SizeUnit } from "@/app/lib/features/datasetsApi";

const FILE_FORMAT_OPTIONS = [
  { value: FileFormat.PARQUET, label: "Parquet" },
  { value: FileFormat.JSON, label: "JSON" },
  { value: FileFormat.CSV, label: "CSV" },
  { value: FileFormat.XML, label: "XML" },
  { value: FileFormat.AVRO, label: "AVRO" },
  { value: FileFormat.ORC, label: "ORC" },
  { value: FileFormat.DELTA_LAKE, label: "Delta Lake" },
  { value: FileFormat.APACHE_ICEBERG, label: "Apache Iceberg" },
  { value: FileFormat.XLSX, label: "XLSX" },
  { value: FileFormat.OTHER, label: "Other" },
];

const SIZE_UNIT_OPTIONS = [
  { value: SizeUnit.BYTES, label: "Bytes" },
  { value: SizeUnit.KILOBYTES, label: "KB" },
  { value: SizeUnit.MEGABYTES, label: "MB" },
  { value: SizeUnit.GIGABYTES, label: "GB" },
  { value: SizeUnit.TERABYTES, label: "TB" },
];

export const DataMetricsStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetSnapshotFormData>();

  const rowCount = watch("row_count");
  const fileCount = watch("file_count");
  const totalSize = watch("total_size");
  const sizeUnit = watch("size_unit");
  const fileFormat = watch("file_format");

  const hasError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Data Metrics <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row Count */}
          <div className="space-y-2">
            <Label htmlFor="row_count">
              Row Count <span className="text-red-500">*</span>
            </Label>
            <Input
              id="row_count"
              type="number"
              {...register("row_count", { valueAsNumber: true })}
              placeholder="e.g., 1500000"
              className={`w-full ${hasError("row_count") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("row_count") && (
              <p className="text-sm text-red-500">{getError("row_count")}</p>
            )}
          </div>

          {/* File Count */}
          <div className="space-y-2">
            <Label htmlFor="file_count">File Count</Label>
            <Input
              id="file_count"
              type="number"
              {...register("file_count", { valueAsNumber: true, setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              placeholder="e.g., 24"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">Number of files/partitions</p>
          </div>

          {/* Total Size */}
          <div className="space-y-2">
            <Label htmlFor="total_size">Total Size</Label>
            <Input
              id="total_size"
              type="number"
              step="0.01"
              {...register("total_size", { valueAsNumber: true, setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              placeholder="e.g., 4.5"
              className="w-full"
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="size_unit">Unit</Label>
            <Select
              key={`size_unit-${sizeUnit || "none"}`}
              value={sizeUnit || "null"}
              onValueChange={(value) =>
                setValue("size_unit", value === "null" ? null : value, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {SIZE_UNIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Format */}
          <div className="space-y-2">
            <Label htmlFor="file_format">
              File Format <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`file_format-${fileFormat || "none"}`}
              value={fileFormat || ""}
              onValueChange={(value) =>
                setValue("file_format", value as FileFormat, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("file_format") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {FILE_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("file_format") && (
              <p className="text-sm text-red-500">{getError("file_format")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
