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
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DatasetModalForm from "@/components/app/datasets/create/DatasetModalForm";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { useGetDatasetSnapshotsQuery } from "@/app/lib/features/datasetSnapshotsApi";
import type { DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const SnapshotIdentificationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetSnapshotFormData>();

  const { data: datasetsData, isLoading: isLoadingDatasets } = useGetDatasetsQuery({});
  const datasets = datasetsData?.data || [];
  const { data: snapshotsData } = useGetDatasetSnapshotsQuery({});
  const snapshots = snapshotsData?.data || [];

  const datasetId = watch("dataset_id");
  const versionTag = watch("version_tag");
  const supersedesSnapshotId = watch("supersedes_snapshot_id");
  const description = watch("description");
  const timeRangeStart = watch("time_range_start");
  const timeRangeEnd = watch("time_range_end");

  const hasError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName]?.message as string;

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert date input value to date string (YYYY-MM-DD)
  const handleDateChange = (field: "time_range_start" | "time_range_end", value: string) => {
    if (value) {
      // Use the date string directly (YYYY-MM-DD format)
      setValue(field, value, { shouldValidate: true });
    } else {
      setValue(field, "", { shouldValidate: true });
    }
  };

  const selectedDataset = datasets.find((ds) => ds.id === datasetId);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Snapshot Identification <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Dataset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dataset_id">
                Dataset <span className="text-red-500">*</span>
              </Label>
              {selectedDataset && (
                <Link
                  href={`/core-assets/data/registry/${selectedDataset.id}/details`}
                  className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                  target="_blank"
                >
                  View
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <SelectWithInlineCreate
              key={`dataset_id-${datasetId || "none"}`}
              value={datasetId ? String(datasetId) : undefined}
              onValueChange={(value) => {
                if (value) {
                  setValue("dataset_id", Number(value), {
                    shouldValidate: true,
                  });
                }
              }}
              options={datasets.map((ds) => ({
                id: String(ds.id),
                label: ds.name,
                value: String(ds.id),
              }))}
              isLoading={isLoadingDatasets}
              isEmpty={!isLoadingDatasets && datasets.length === 0}
              entityName="Dataset"
              modalForm={DatasetModalForm}
              placeholder="Select..."
              error={!!hasError("dataset_id")}
            />
            {hasError("dataset_id") && (
              <p className="text-sm text-red-500">{getError("dataset_id")}</p>
            )}
          </div>

          {/* Version Tag */}
          <div className="space-y-2">
            <Label htmlFor="version_tag">
              Version Tag <span className="text-red-500">*</span>
            </Label>
            <Input
              id="version_tag"
              {...register("version_tag")}
              placeholder="e.g., v2.1"
              className={`w-full ${hasError("version_tag") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            <p className="text-xs text-[#667085]">Semantic versioning recommended</p>
            {hasError("version_tag") && (
              <p className="text-sm text-red-500">{getError("version_tag")}</p>
            )}
          </div>

          {/* Supersedes Snapshot */}
          <div className="space-y-2">
            <Label htmlFor="supersedes_snapshot_id">Supersedes Snapshot</Label>
            <Select
              key={`supersedes_snapshot_id-${supersedesSnapshotId || "none"}`}
              value={supersedesSnapshotId ? String(supersedesSnapshotId) : "null"}
              onValueChange={(value) =>
                setValue("supersedes_snapshot_id", value === "null" ? null : Number(value), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {snapshots.map((snapshot) => (
                  <SelectItem key={snapshot.id} value={String(snapshot.id)}>
                    {snapshot.version_tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[#667085]">Previous version this replaces</p>
          </div>

          {/* Description / Purpose */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description / Purpose</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Why this snapshot was created, what it contains..."
              className="min-h-32 resize-none w-full"
            />
          </div>

          {/* Data Range Start */}
          <div className="space-y-2">
            <Label htmlFor="time_range_start">
              Data Range Start <span className="text-red-500">*</span>
            </Label>
            <Input
              id="time_range_start"
              type="date"
              value={formatDateForInput(timeRangeStart)}
              onChange={(e) => handleDateChange("time_range_start", e.target.value)}
              className={`w-full ${hasError("time_range_start") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("time_range_start") && (
              <p className="text-sm text-red-500">{getError("time_range_start")}</p>
            )}
          </div>

          {/* Data Range End */}
          <div className="space-y-2">
            <Label htmlFor="time_range_end">
              Data Range End <span className="text-red-500">*</span>
            </Label>
            <Input
              id="time_range_end"
              type="date"
              value={formatDateForInput(timeRangeEnd)}
              onChange={(e) => handleDateChange("time_range_end", e.target.value)}
              className={`w-full ${hasError("time_range_end") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("time_range_end") && (
              <p className="text-sm text-red-500">{getError("time_range_end")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
