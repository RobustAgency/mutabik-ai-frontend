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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";
import type { DataElementFormData } from "@/lib/schemas/dataElement.schema";

export const PhysicalLocationStep: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const { data: dataSourcesData } = useGetDataSourcesQuery({});
  const dataSources = dataSourcesData?.data || [];

  // These are UI-only fields for now (not in backend API)
  const dataSource = watch("data_source" as any);
  const schemaName = watch("schema_name" as any);
  const columnName = watch("column_name" as any);
  const databaseName = watch("database_name" as any);
  const tableName = watch("table_name" as any);

  // Mock datasets - this would come from API in real implementation
  const usedInDatasets = [
    "Customer Training Set",
    "Product Images",
    "Transaction History",
    "Health Records Dataset",
  ];

  return (
    <div className="space-y-6">
      {/* Physical Location */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
            Physical Location <span className="text-red-500">*</span>
          </h3>
          <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
            Lineage
          </h3>
        </div>

        {/* Info Banner */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Complete physical path enables full traceability: Model → Dataset → Element → Database Field
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Source */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="data_source">
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
            <Select
              key={`data_source-${dataSource || "none"}`}
              value={dataSource || ""}
              onValueChange={(value) => {
                // UI-only field, not submitted to backend
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map((source) => (
                  <SelectItem key={source.id} value={String(source.id)}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Database Name */}
          <div className="space-y-2">
            <Label htmlFor="database_name">
              Database Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="database_name"
              {...(register("database_name" as any) as any)}
              placeholder="e.g., crm_prod"
              className="w-full"
            />
          </div>

          {/* Schema Name */}
          <div className="space-y-2">
            <Label htmlFor="schema_name">Schema Name</Label>
            <Input
              id="schema_name"
              {...(register("schema_name" as any) as any)}
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
              {...(register("table_name" as any) as any)}
              placeholder="e.g., customers"
              className="w-full"
            />
          </div>

          {/* Column Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="column_name">
              Column Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="column_name"
              {...(register("column_name" as any) as any)}
              placeholder="e.g., email_address"
              className="w-full"
            />
          </div>
        </div>

        {/* Used in Dataset(s) */}
        <div className="space-y-2">
          <Label>Used in Dataset(s)</Label>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
            {usedInDatasets.length > 0 ? (
              usedInDatasets.map((dataset, index) => (
                <Badge
                  key={index}
                  variant="light"
                  className="bg-gray-100 text-gray-700 border-gray-300"
                >
                  {dataset}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">No datasets found</span>
            )}
          </div>
          <p className="text-xs text-gray-500">Datasets containing this element</p>
        </div>
      </div>
    </div>
  );
};

