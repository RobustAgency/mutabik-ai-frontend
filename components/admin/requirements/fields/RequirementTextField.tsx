"use client";

import { Label } from "@/components/ui/label";
import { CreateRequirementRequest } from "@/interfaces/Requirement";

interface RequirementTextFieldProps {
  formData: CreateRequirementRequest;
  isLoading?: boolean;
  onInputChange: <K extends keyof CreateRequirementRequest>(
    field: K,
    value: CreateRequirementRequest[K]
  ) => void;
}

export default function RequirementTextField({
  formData,
  isLoading = false,
  onInputChange,
}: RequirementTextFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">
        Requirement Text
      </Label>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-4 py-2 min-h-[120px]"
        value={formData.requirement_text || ""}
        onChange={(e) => onInputChange("requirement_text", e.target.value)}
        placeholder="Enter the requirement details"
        disabled={isLoading}
      />
    </div>
  );
}

