"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ConsentRecordFormData } from "@/lib/schemas/consentRecord.schema";

const statusOptions = [
  { value: "granted", label: "Granted" },
  { value: "denied", label: "Denied" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "expired", label: "Expired" },
];

const lifecycleOptions = [
  { value: "obtained", label: "Obtained" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring" },
  { value: "expired", label: "Expired" },
  { value: "withdrawn", label: "Withdrawn" },
];

const methodOptions = [
  { value: "explicit_opt_in", label: "Explicit Opt-in" },
  { value: "implied", label: "Implied" },
  { value: "pre_checked", label: "Pre-checked" },
  { value: "verbal", label: "Verbal" },
  { value: "written", label: "Written" },
];

export const ConsentDetailsStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConsentRecordFormData>();

  const consentText = watch("consent_text");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`status-${watch("status") || "none"}`}
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lifecycle_stage">
            Lifecycle Stage <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("lifecycle_stage")}
            onValueChange={(value) => setValue("lifecycle_stage", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select lifecycle stage" />
            </SelectTrigger>
            <SelectContent>
              {lifecycleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="consent_version">
            Consent Version <span className="text-red-500">*</span>
          </Label>
          <Input
            id="consent_version"
            type="number"
            {...register("consent_version", { valueAsNumber: true })}
            className={`w-full ${
              errors.consent_version ? "border-red-500" : ""
            }`}
            min={1}
          />
          {errors.consent_version && (
            <p className="text-sm text-red-500">
              {errors.consent_version.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="consent_text">
          Consent Text <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="consent_text"
          {...register("consent_text")}
          className={`w-full min-h-[150px] resize-none ${
            errors.consent_text ? "border-red-500" : ""
          }`}
          placeholder="Enter consent text shown to the user"
          rows={6}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.consent_text?.message}</span>
          <span>{consentText?.length || 0} characters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="consent_method">
            Consent Method <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`consent_method-${watch("consent_method") || "none"}`}
            value={watch("consent_method")}
            onValueChange={(value) => setValue("consent_method", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {methodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="effective_from">
            Effective From <span className="text-red-500">*</span>
          </Label>
          <Input
            id="effective_from"
            type="date"
            {...register("effective_from")}
            className={`w-full ${
              errors.effective_from ? "border-red-500" : ""
            }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="effective_to">Effective To</Label>
          <Input
            id="effective_to"
            type="date"
            {...register("effective_to")}
            className={`w-full ${
              errors.effective_to ? "border-red-500" : ""
            }`}
          />
          {errors.effective_to && (
            <p className="text-sm text-red-500">
              {errors.effective_to.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


