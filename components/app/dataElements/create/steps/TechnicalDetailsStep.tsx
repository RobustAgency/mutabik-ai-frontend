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
import type { DataElementFormData } from "@/lib/schemas/dataElement.schema";

export const TechnicalDetailsStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const isNullable = watch("is_nullable");
  const isUnique = watch("is_unique");
  const defaultValue = watch("default_value");
  const validationRule = watch("validation_rule");
  const sampleValues = watch("sample_values");

  return (
    <div className="space-y-6">
      {/* Technical Details */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Technical Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Is Nullable */}
          <div className="space-y-2">
            <Label htmlFor="is_nullable">Is Nullable</Label>
            <Select
              key={`is_nullable-${isNullable === null ? "none" : isNullable}`}
              value={isNullable === null ? "" : String(isNullable)}
              onValueChange={(value) => {
                // Always set to boolean: true or false, never null
                const boolValue = value === "true";
                setValue("is_nullable", boolValue, {
                  shouldValidate: false,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Is Unique */}
          <div className="space-y-2">
            <Label htmlFor="is_unique">Is Unique</Label>
            <Select
              key={`is_unique-${isUnique === null ? "none" : isUnique}`}
              value={isUnique === null ? "" : String(isUnique)}
              onValueChange={(value) => {
                // Always set to boolean: true or false, never null
                const boolValue = value === "true";
                setValue("is_unique", boolValue, {
                  shouldValidate: false,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default Value */}
          <div className="space-y-2">
            <Label htmlFor="default_value">Default Value</Label>
            <Input
              id="default_value"
              {...register("default_value")}
              placeholder="e.g., null, 0, 'unknown'"
              className="w-full"
            />
          </div>

          {/* Validation Rule */}
          <div className="space-y-2">
            <Label htmlFor="validation_rule">Validation Rule</Label>
            <Input
              id="validation_rule"
              {...register("validation_rule")}
              placeholder="e.g., ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$"
              className="w-full"
            />
            <p className="text-xs text-gray-500">Regex or rule description</p>
          </div>

          {/* Sample Values */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sample_values">Sample Values</Label>
            <Input
              id="sample_values"
              {...register("sample_values")}
              placeholder="e.g., john@email.com"
              className="w-full"
            />
            <p className="text-xs text-gray-500">Enter a single sample value. Redact if PII</p>
          </div>
        </div>
      </div>
    </div>
  );
};

