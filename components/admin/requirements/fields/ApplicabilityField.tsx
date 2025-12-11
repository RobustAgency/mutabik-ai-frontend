"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRequirementRequest } from "@/interfaces/Requirement";

interface ApplicabilityFieldProps {
  formData: CreateRequirementRequest;
  errors: Record<string, string[]>;
  isLoading?: boolean;
  onInputChange: <K extends keyof CreateRequirementRequest>(
    field: K,
    value: CreateRequirementRequest[K]
  ) => void;
}

export default function ApplicabilityField({
  formData,
  errors,
  isLoading = false,
  onInputChange,
}: ApplicabilityFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">
        Applicability <span className="text-red-500">*</span>
      </Label>
      <Input
        type="text"
        value={formData.applicability}
        onChange={(e) => onInputChange("applicability", e.target.value)}
        placeholder="Who/what this requirement applies to"
        className={`w-full h-12 rounded-lg border px-4 ${
          errors.applicability ? "border-red-500" : "border-gray-300"
        }`}
        disabled={isLoading}
      />
      {errors.applicability && (
        <p className="text-sm text-red-500 mt-1">{errors.applicability[0]}</p>
      )}
    </div>
  );
}

