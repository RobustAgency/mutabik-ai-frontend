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
import { CountryDropdown } from "react-country-region-selector";
import type { StakeholderFormData } from "@/lib/schemas/stakeholder.schema";

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "America/Chicago", label: "America/Chicago (CST)" },
  { value: "America/Denver", label: "America/Denver (MST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
];

export const OrganizationDetailsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StakeholderFormData>();

  const classification = watch("classification");
  const country = watch("country");
  const timezone = watch("timezone");

  const hasError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 3: Organization Details
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classification */}
        <div className="space-y-2">
          <Label htmlFor="classification">
            Classification <span className="text-red-500">*</span>
          </Label>
          <Select
            value={classification || ""}
            onValueChange={(value) =>
              setValue("classification", value as "internal" | "external", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${hasError("classification") ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
          {hasError("classification") && (
            <p className="text-sm text-red-500">{getError("classification")}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <div className={hasError("country") ? "border-red-500 rounded-md border" : ""}>
            <CountryDropdown
              id="country"
              valueType="short"
              value={country || ""}
              onChange={(val) => setValue("country", val, { shouldValidate: true })}
              aria-label="Select country"
              className="w-full h-[36px] text-gray-500 rounded-md border border-input bg-background px-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {hasError("country") && (
            <p className="text-sm text-red-500">{getError("country")}</p>
          )}
        </div>

        {/* Timezone */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="timezone">
            Timezone <span className="text-red-500">*</span>
          </Label>
          <Select
            value={timezone || ""}
            onValueChange={(value) => setValue("timezone", value, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("timezone") ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("timezone") && (
            <p className="text-sm text-red-500">{getError("timezone")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

