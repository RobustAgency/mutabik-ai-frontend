"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Database, Cpu, Server, Box, FileCode, Users, Link2 } from "lucide-react";
import type { AgreementFormData } from "@/lib/schemas/agreement.schema";

const ASSET_TYPE_OPTIONS = [
  { value: "ai_model", label: "AI Models", icon: Cpu, desc: "LLMs, ML models, embeddings, etc." },
  { value: "dataset", label: "Datasets", icon: Database, desc: "Training data, evaluation sets, etc." },
  { value: "data_source", label: "Data Sources", icon: Server, desc: "APIs, databases, data feeds" },
  { value: "infrastructure", label: "Infrastructure", icon: Box, desc: "Cloud, compute, storage" },
  { value: "software", label: "Software/SaaS", icon: FileCode, desc: "Applications, platforms, tools" },
  { value: "service", label: "Services", icon: Users, desc: "Consulting, annotation, support" },
];

export const AgreementCoversStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AgreementFormData>();

  const assetTypesCovered = watch("asset_types_covered") || [];

  const handleAssetTypeToggle = (assetType: string) => {
    const newTypes = assetTypesCovered.includes(assetType)
      ? assetTypesCovered.filter((t) => t !== assetType)
      : [...assetTypesCovered, assetType];
    setValue("asset_types_covered", newTypes, { shouldValidate: true });
  };

  const removeAssetType = (assetType: string) => {
    setValue(
      "asset_types_covered",
      assetTypesCovered.filter((t) => t !== assetType),
      { shouldValidate: true }
    );
  };

  const getAssetTypeConfig = (value: string) => {
    return ASSET_TYPE_OPTIONS.find((t) => t.value === value);
  };

  const hasError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 2: Agreement Covers
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Asset Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="asset_types_covered">
          Asset Types Covered <span className="text-red-500">*</span>
        </Label>
        {hasError("asset_types_covered") && (
          <p className="text-sm text-red-500">{getError("asset_types_covered")}</p>
        )}
        <p className="text-xs text-gray-500 mb-3">
          Select what types of assets this agreement covers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ASSET_TYPE_OPTIONS.map((assetType) => {
            const isSelected = assetTypesCovered.includes(assetType.value);
            const IconComponent = assetType.icon;
            return (
              <label
                key={assetType.value}
                className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "border-[#039855] bg-green-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-[#039855] focus:ring-[#039855]"
                  checked={isSelected}
                  onChange={() => handleAssetTypeToggle(assetType.value)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className={`font-medium ${isSelected ? "text-[#039855]" : "text-gray-900"}`}>
                      {assetType.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{assetType.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Selected Asset Types Display */}
      {assetTypesCovered.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected asset types ({assetTypesCovered.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {assetTypesCovered.map((assetTypeValue) => {
              const config = getAssetTypeConfig(assetTypeValue);
              return (
                <Badge
                  key={assetTypeValue}
                  variant="light"
                  color="success"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {config?.label || assetTypeValue}
                  <button
                    type="button"
                    onClick={() => removeAssetType(assetTypeValue)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Asset Linkage Info */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Link2 className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Linking Assets</h4>
            <p className="text-sm text-gray-600 mt-1">
              Datasets, Models, and Data Sources will be linked to this agreement from their
              respective registries using the "Covered by Agreement" field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

