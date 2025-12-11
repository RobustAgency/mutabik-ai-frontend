"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRequirementRequest } from "@/interfaces/Requirement";

interface EffectiveDatesFieldsProps {
  formData: CreateRequirementRequest;
  errors: Record<string, string[]>;
  isLoading?: boolean;
  onInputChange: <K extends keyof CreateRequirementRequest>(
    field: K,
    value: CreateRequirementRequest[K]
  ) => void;
}

export default function EffectiveDatesFields({
  formData,
  errors,
  isLoading = false,
  onInputChange,
}: EffectiveDatesFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Effective From
        </Label>
        <Input
          type="date"
          value={formData.effective_from || ""}
          onChange={(e) => onInputChange("effective_from", e.target.value)}
          className={`w-full h-12 rounded-lg border px-4 ${
            errors.effective_from ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.effective_from && (
          <p className="text-sm text-red-500 mt-1">
            {errors.effective_from[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">Effective To</Label>
        <Input
          type="date"
          value={formData.effective_to || ""}
          onChange={(e) => onInputChange("effective_to", e.target.value)}
          className={`w-full h-12 rounded-lg border px-4 ${
            errors.effective_to ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.effective_to && (
          <p className="text-sm text-red-500 mt-1">{errors.effective_to[0]}</p>
        )}
      </div>
    </div>
  );
}

