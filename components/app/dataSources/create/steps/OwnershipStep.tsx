"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { DataSourceFormData } from "@/lib/schemas/dataSource.schema";
import {
  OwnerTeam,
} from "@/app/lib/features/dataSourcesApi";

const OWNER_TEAM_OPTIONS = [
  { value: OwnerTeam.DATA_ENGINEERING_TEAM, label: "Data Engineering Team" },
  { value: OwnerTeam.ML_PLATFORM_TEAM, label: "ML Platform Team" },
  { value: OwnerTeam.PRIVACY_OFFICE, label: "Privacy Office" },
  { value: OwnerTeam.AI_GOVERNANCE_BOARD, label: "AI Governance Board" },
];

export const OwnershipStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataSourceFormData>();

  const technicalOwner = watch("technical_owner");
  const businessOwner = watch("business_owner");

  const hasError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Ownership <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Owner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="technical_owner">
              Technical Owner <span className="text-red-500">*</span>
            </Label>
          </div>
          <Select
            key={`technical_owner-${technicalOwner || "none"}`}
            value={technicalOwner || ""}
            onValueChange={(value) => setValue("technical_owner", value as OwnerTeam, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("technical_owner") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
          {hasError("technical_owner") && (
            <p className="text-sm text-red-500">{getError("technical_owner")}</p>
          )}
        </div>

        {/* Business Owner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="business_owner">
              Business Owner <span className="text-red-500">*</span>
            </Label>
          </div>
          <Select
            key={`business_owner-${businessOwner || "none"}`}
            value={businessOwner || ""}
            onValueChange={(value) => setValue("business_owner", value as OwnerTeam, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("business_owner") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
          {hasError("business_owner") && (
            <p className="text-sm text-red-500">{getError("business_owner")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
