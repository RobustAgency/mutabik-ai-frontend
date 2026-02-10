"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AgreementFormData } from "@/lib/schemas/agreement.schema";

const RENEWAL_TYPE_OPTIONS = [
  { value: "auto_renewal", label: "Auto Renewal" },
  { value: "manual_renewal", label: "Manual Renewal" },
  { value: "one_time_fixed_term", label: "One Time Fixed Term" },
  { value: "evergreen", label: "Evergreen" },
];

const GOVERNING_LAW_OPTIONS = [
  { value: "delaware", label: "Delaware" },
  { value: "california", label: "California" },
  { value: "england_new_wales", label: "England & Wales" },
  { value: "uae_federal", label: "UAE Federal" },
  { value: "germany", label: "Germany" },
  { value: "singapore", label: "Singapore" },
];

export const RenewalTerminationStep: React.FC = () => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<AgreementFormData>();

  const renewalType = watch("renewal_type");
  const noticePeriodDays = watch("notice_period_days");
  const terminationForConvenience = watch("termination_for_convenience");
  const governingLaw = watch("governing_law");

  const hasError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 3: Renewal & Termination
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Renewal Type */}
        <div className="space-y-2">
          <Label htmlFor="renewal_type">Renewal Type</Label>
          <Select
            key={`renewal_type-select-${renewalType || "none"}`}
            value={renewalType || ""}
            onValueChange={(value) =>
              setValue("renewal_type", value ? (value as any) : null, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select renewal type" />
            </SelectTrigger>
            <SelectContent>
              {RENEWAL_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("renewal_type") && (
            <p className="text-sm text-red-500">{getError("renewal_type")}</p>
          )}
        </div>

        {/* Notice Period Days */}
        <div className="space-y-2">
          <Label htmlFor="notice_period_days">Notice Period (Days)</Label>
          <Input
            id="notice_period_days"
            type="number"
            min="0"
            {...register("notice_period_days", { valueAsNumber: true })}
            className={hasError("notice_period_days") ? "border-red-500" : ""}
            placeholder="e.g., 30"
          />
          {hasError("notice_period_days") && (
            <p className="text-sm text-red-500">{getError("notice_period_days")}</p>
          )}
        </div>

        {/* Termination for Convenience */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="termination_for_convenience"
              checked={terminationForConvenience || false}
              onCheckedChange={(checked) =>
                setValue("termination_for_convenience", checked === true ? true : null, {
                  shouldValidate: true,
                })
              }
            />
            <Label
              htmlFor="termination_for_convenience"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Termination for Convenience Allowed
            </Label>
          </div>
          {hasError("termination_for_convenience") && (
            <p className="text-sm text-red-500">{getError("termination_for_convenience")}</p>
          )}
        </div>

        {/* Governing Law */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="governing_law">Governing Law</Label>
          <Select
            key={`governing_law-select-${governingLaw || "none"}`}
            value={governingLaw || ""}
            onValueChange={(value) =>
              setValue("governing_law", value ? (value as any) : null, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select governing law" />
            </SelectTrigger>
            <SelectContent>
              {GOVERNING_LAW_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("governing_law") && (
            <p className="text-sm text-red-500">{getError("governing_law")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

