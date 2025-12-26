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
import { CountryDropdown } from "react-country-region-selector";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

const RISK_TIER_OPTIONS = [
  { value: "tier_1", label: "Tier 1" },
  { value: "tier_2", label: "Tier 2" },
  { value: "tier_3", label: "Tier 3" },
  { value: "tier_4", label: "Tier 4" },
];

const STATUS_OPTIONS = [
  { value: "evaluating", label: "Evaluating" },
  { value: "approved", label: "Approved" },
  { value: "conditionally_approved", label: "Conditionally Approved" },
  { value: "restricted", label: "Restricted" },
  { value: "suspended", label: "Suspended" },
  { value: "terminated", label: "Terminated" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  const hqCountry = watch("hq_country");
  const riskTier = watch("risk_tier");
  const status = watch("status");

  const hasError = (fieldName: keyof VendorFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof VendorFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 1: Basic Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendor Name */}
        <div className="space-y-2">
          <Label htmlFor="vendor_name">
            Vendor Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vendor_name"
            {...register("vendor_name")}
            className={hasError("vendor_name") ? "border-red-500" : ""}
            placeholder="e.g., OpenAI, Snowflake"
          />
          {hasError("vendor_name") && (
            <p className="text-sm text-red-500">{getError("vendor_name")}</p>
          )}
        </div>

        {/* Legal Name */}
        <div className="space-y-2">
          <Label htmlFor="legal_name">
            Legal Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="legal_name"
            {...register("legal_name")}
            className={hasError("legal_name") ? "border-red-500" : ""}
            placeholder="e.g., OpenAI, Inc."
          />
          {hasError("legal_name") && (
            <p className="text-sm text-red-500">{getError("legal_name")}</p>
          )}
        </div>

        {/* HQ Country */}
        <div className="space-y-2">
          <Label htmlFor="hq_country">
            HQ Country <span className="text-red-500">*</span>
          </Label>
          <div className={hasError("hq_country") ? "border-red-500 rounded-md border" : ""}>
            <CountryDropdown
              id="hq_country"
              valueType="short"
              value={hqCountry || ""}
              onChange={(val) => setValue("hq_country", val.toUpperCase(), { shouldValidate: true })}
              aria-label="Select HQ country"
              className="w-full h-[36px] text-gray-500 rounded-md border border-input bg-background px-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {hasError("hq_country") && (
            <p className="text-sm text-red-500">{getError("hq_country")}</p>
          )}
        </div>

        {/* Risk Tier */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="risk_tier">
            Risk Tier <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`risk_tier-select-${riskTier || "none"}-${Date.now()}`}
            value={riskTier || ""}
            onValueChange={(value) => setValue("risk_tier", value as any, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("risk_tier") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select risk tier" />
            </SelectTrigger>
            <SelectContent>
              {RISK_TIER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("risk_tier") && (
            <p className="text-sm text-red-500">{getError("risk_tier")}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={status || ""}
            onValueChange={(value) => setValue("status", value as any, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select status" />
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
    </div>
  );
};
