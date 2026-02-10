"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";
import type { DataElementFormData } from "@/lib/schemas/dataElement.schema";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DataSourceModalForm from "@/components/app/dataSources/create/DataSourceModalForm";

export const PhysicalLocationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const { data: dataSourcesData, isLoading: isDataSourcesLoading } = useGetDataSourcesQuery({});
  const dataSources = dataSourcesData?.data || [];

  const dataSourceId = watch("data_source_id");
  const schemaName = watch("schema_name");
  const columnName = watch("column_name");
  const databaseName = watch("database_name");
  const tableName = watch("table_name");
  const usedInDatasets = watch("used_in_datasets") || [];

  // Local state for the comma-separated input
  const [datasetsInput, setDatasetsInput] = useState("");

  const hasError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName]?.message as string;

  // Convert dataSources to SelectOption format
  const dataSourceOptions = dataSources.map((source) => ({
    id: source.id,
    label: source.name,
    value: String(source.id),
  }));

  // Sync input with form state (array to comma-separated string)
  useEffect(() => {
    if (usedInDatasets && Array.isArray(usedInDatasets) && usedInDatasets.length > 0) {
      setDatasetsInput(usedInDatasets.join(", "));
    }
  }, []); // Only on mount

  // Handle input change - parse comma-separated values
  const handleDatasetsInputChange = (value: string) => {
    setDatasetsInput(value);
    
    // Parse comma-separated values, trim whitespace, and filter empty strings
    const parsed = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    
    setValue("used_in_datasets", parsed.length > 0 ? parsed : null, {
      shouldValidate: false,
    });
  };

  // Remove a dataset from the array
  const removeDataset = (datasetName: string) => {
    const currentDatasets = usedInDatasets || [];
    const updated = currentDatasets.filter((name) => name !== datasetName);
    setValue("used_in_datasets", updated.length > 0 ? updated : null, {
      shouldValidate: false,
    });
    // Update input to reflect the change
    setDatasetsInput(updated.length > 0 ? updated.join(", ") : "");
  };

  return (
    <div className="space-y-6">
      {/* Physical Location */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
            Physical Location
          </h3>
          <Badge color={"success"}>
            Lineage
          </Badge>
        </div>

        {/* Info Banner */}
        {/* <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Complete physical path enables full traceability: Model → Dataset → Element → Database Field
          </AlertDescription>
        </Alert> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Source */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="data_source_id">
                Data Source <span className="text-red-500">*</span>
              </Label>
              <Link
                href="/core-assets/data/sources"
                className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
              >
                View Sources
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <SelectWithInlineCreate
              key={`data_source_id-${dataSourceId || "none"}`}
              value={dataSourceId ? String(dataSourceId) : ""}
              onValueChange={(value) => {
                if (value) {
                  setValue("data_source_id", Number(value), {
                    shouldValidate: true,
                  });
                } else {
                  // Clear the value if empty
                  setValue("data_source_id", 0, {
                    shouldValidate: true,
                  });
                }
              }}
              placeholder="Select a data source..."
              options={dataSourceOptions}
              isLoading={isDataSourcesLoading}
              isEmpty={!isDataSourcesLoading && dataSourceOptions.length === 0}
              entityName="Data Source"
              modalForm={DataSourceModalForm}
              canCreate={true}
              modalTitle="Create New Data Source"
              modalDescription="Add a new data source to the system"
              error={!!hasError("data_source_id")}
              triggerClassName={hasError("data_source_id") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            />
            {hasError("data_source_id") && (
              <p className="text-sm text-red-500">{getError("data_source_id")}</p>
            )}
          </div>

          {/* Database Name */}
          <div className="space-y-2">
            <Label htmlFor="database_name">
              Database Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="database_name"
              {...register("database_name")}
              placeholder="e.g., crm_prod"
              className={`w-full ${hasError("database_name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("database_name") && (
              <p className="text-sm text-red-500">{getError("database_name")}</p>
            )}
          </div>

          {/* Schema Name */}
          <div className="space-y-2">
            <Label htmlFor="schema_name">Schema Name</Label>
            <Input
              id="schema_name"
              {...register("schema_name")}
              placeholder="e.g., public, dbo"
              className="w-full"
            />
          </div>

          {/* Table Name */}
          <div className="space-y-2">
            <Label htmlFor="table_name">
              Table Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="table_name"
              {...register("table_name")}
              placeholder="e.g., customers"
              className={`w-full ${hasError("table_name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("table_name") && (
              <p className="text-sm text-red-500">{getError("table_name")}</p>
            )}
          </div>

          {/* Column Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="column_name">
              Column Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="column_name"
              {...register("column_name")}
              placeholder="e.g., email_address"
              className={`w-full ${hasError("column_name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("column_name") && (
              <p className="text-sm text-red-500">{getError("column_name")}</p>
            )}
          </div>
        </div>

        {/* Used in Dataset(s) */}
        <div className="space-y-2">
          <Label>Used in Dataset(s)</Label>
          
          {/* Input field for comma-separated dataset names */}
          <Input
            id="used_in_datasets"
            value={datasetsInput}
            onChange={(e) => handleDatasetsInputChange(e.target.value)}
            placeholder="e.g., Dataset 1, Dataset 2, Dataset 3"
            className="w-full"
          />

          {/* Display parsed datasets as badges */}
          {usedInDatasets && usedInDatasets.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
              {usedInDatasets.map((datasetName, index) => (
                <Badge
                  key={index}
                  variant="light"
                  className="bg-gray-100 text-gray-700 border-gray-300 flex items-center gap-1"
                >
                  <span>{datasetName}</span>
                  <button
                    type="button"
                    onClick={() => removeDataset(datasetName)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Enter dataset names separated by commas. They will be sent as an array to the backend.
          </p>
        </div>
      </div>
    </div>
  );
};

