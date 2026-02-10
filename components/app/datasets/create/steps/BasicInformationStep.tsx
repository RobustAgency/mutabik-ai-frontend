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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DataSourceModalForm from "@/components/app/dataSources/create/DataSourceModalForm";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";
import type { DatasetFormData } from "@/lib/schemas/dataset.schema";
import {
  Purpose,
  OwnerTeam,
  DataSteward,
  Status,
} from "@/app/lib/features/datasetsApi";

const PURPOSE_OPTIONS = [
  { value: Purpose.AI_ML_TRAINING, label: "AI/ML Training" },
  { value: Purpose.AI_ML_FINE_TUNING, label: "AI/ML Fine-Tuning" },
  { value: Purpose.AI_ML_RETRIEVAL, label: "AI/ML Retrieval" },
  { value: Purpose.AI_ML_EVALUATION, label: "AI/ML Evaluation" },
  { value: Purpose.ANALYTIC_BUSINESS_INTELLIGENCE, label: "Analytic/Business Intelligence" },
  { value: Purpose.OPERATIONAL_TRANSFORMATION, label: "Operational/Transformation" },
  { value: Purpose.MASTER_DATA, label: "Master Data" },
  { value: Purpose.REFERENCE_DATA, label: "Reference Data" },
  { value: Purpose.REPORTING, label: "Reporting" },
  { value: Purpose.COMPLIANCE_AUDIT, label: "Compliance/Audit" },
  { value: Purpose.ARCHIVAL_HISTORICAL, label: "Archival/Historical" },
];

const OWNER_TEAM_OPTIONS = [
  { value: OwnerTeam.DATA_ENGINEERING_TEAM, label: "Data Engineering Team" },
  { value: OwnerTeam.ML_PLATFORM_TEAM, label: "ML Platform Team" },
  { value: OwnerTeam.PRIVACY_OFFICE, label: "Privacy Office" },
  { value: OwnerTeam.AI_GOVERNANCE_BOARD, label: "AI Governance Board" },
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
  } = useFormContext<DatasetFormData>();

  const { data: dataSourcesData, isLoading: isDataSourcesLoading } = useGetDataSourcesQuery({});
  const dataSources = dataSourcesData?.data || [];

  const purpose = watch("purpose");
  const ownerTeam = watch("owner_team");
  const dataSteward = watch("data_steward");
  const sourceIds = watch("source_ids") || [];

  const hasError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName]?.message as string;

  const handleAddSource = (value: string) => {
    const intValue = parseInt(value, 10);
    if (!isNaN(intValue) && !sourceIds.includes(intValue)) {
      setValue("source_ids", [...sourceIds, intValue], { shouldValidate: true });
    }
  };

  const handleRemoveSource = (sourceIdToRemove: number) => {
    setValue(
      "source_ids",
      sourceIds.filter((id) => id !== sourceIdToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Dataset Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Dataset Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            className={hasError("name") ? "border-red-500" : ""}
            placeholder="e.g., Customer Training Set"
          />
          {hasError("name") && (
            <p className="text-sm text-red-500">{getError("name")}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            className={`min-h-32 ${hasError("description") ? "border-red-500" : ""}`}
            placeholder="Purpose and contents of this dataset..."
          />
          {hasError("description") && (
            <p className="text-sm text-red-500">{getError("description")}</p>
          )}
        </div>

        {/* Primary Purpose */}
        <div className="space-y-2">
          <Label htmlFor="purpose">
            Primary Purpose <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`purpose-${purpose || "none"}`}
            value={purpose || ""}
            onValueChange={(value) => setValue("purpose", value as Purpose, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("purpose") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {PURPOSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("purpose") && (
            <p className="text-sm text-red-500">{getError("purpose")}</p>
          )}
        </div>

        {/* Owner Team */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="owner_team">
              Owner Team <span className="text-red-500">*</span>
            </Label>
           
          </div>
          <Select
            key={`owner_team-${ownerTeam || "none"}`}
            value={ownerTeam || ""}
            onValueChange={(value) => setValue("owner_team", value as OwnerTeam, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("owner_team") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {OWNER_TEAM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("owner_team") && (
            <p className="text-sm text-red-500">{getError("owner_team")}</p>
          )}
        </div>

        {/* Data Steward */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="data_steward">
              Data Steward <span className="text-red-500">*</span>
            </Label>
            
          </div>
          <Select
            key={`data_steward-${dataSteward || "none"}`}
            value={dataSteward || ""}
            onValueChange={(value) => setValue("data_steward", value as DataSteward, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("data_steward") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
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
          {hasError("data_steward") && (
            <p className="text-sm text-red-500">{getError("data_steward")}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`status-${status || "none"}`}
            value={status || ""}
            onValueChange={(value) => setValue("status", value as Status, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
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
          {hasError("status") && (
            <p className="text-sm text-red-500">{getError("status")}</p>
          )}
        </div>
      </div>

      {/* Data Source(s) */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="source_ids">
          Data Source(s) <span className="text-red-500">*</span>
        </Label>
        <SelectWithInlineCreate
          value=""
          onValueChange={handleAddSource}
          options={dataSources.map((source) => ({
            id: source.id,
            label: source.name,
            value: String(source.id),
          }))}
          isLoading={isDataSourcesLoading}
          isEmpty={!isDataSourcesLoading && dataSources.length === 0}
          entityName="Data Source"
          modalForm={DataSourceModalForm}
          placeholder={isDataSourcesLoading ? "Loading sources..." : "Choose a data source"}
          error={!!hasError("source_ids")}
        />
        {hasError("source_ids") && (
          <p className="text-sm text-red-500">{getError("source_ids")}</p>
        )}
        {sourceIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sourceIds.map((sourceId) => {
              const source = dataSources.find((s) => s.id === sourceId);
              return (
                <Badge
                  key={sourceId}
                  variant="outlined"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {source?.name || `Source ${sourceId}`}
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(sourceId)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

