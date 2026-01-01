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
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  // These are UI-only fields for now (not in backend API)
  const isNullable = watch("is_nullable" as any);
  const isUnique = watch("is_unique" as any);

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
              key={`is_nullable-${isNullable || "none"}`}
              value={isNullable || ""}
              onValueChange={(value) => {
                // UI-only field, not submitted to backend
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Is Unique */}
          <div className="space-y-2">
            <Label htmlFor="is_unique">Is Unique</Label>
            <Select
              key={`is_unique-${isUnique || "none"}`}
              value={isUnique || ""}
              onValueChange={(value) => {
                // UI-only field, not submitted to backend
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default Value */}
          <div className="space-y-2">
            <Label htmlFor="default_value">Default Value</Label>
            <Input
              id="default_value"
              {...(register("default_value" as any) as any)}
              placeholder="e.g., null, 0, 'unknown'"
              className="w-full"
            />
          </div>

          {/* Validation Rule */}
          <div className="space-y-2">
            <Label htmlFor="validation_rule">Validation Rule</Label>
            <Input
              id="validation_rule"
              {...(register("validation_rule" as any) as any)}
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
              {...(register("sample_values" as any) as any)}
              placeholder="e.g., john@email.com, jane@company.org"
              className="w-full"
            />
            <p className="text-xs text-gray-500">Redact if PII</p>
          </div>
        </div>
      </div>
    </div>
  );
};

