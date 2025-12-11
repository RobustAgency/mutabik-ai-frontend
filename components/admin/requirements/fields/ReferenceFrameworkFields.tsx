"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRequirementRequest } from "@/interfaces/Requirement";

interface ReferenceFrameworkFieldsProps {
  formData: CreateRequirementRequest;
  errors: Record<string, string[]>;
  frameworkOptions: { value: string; label: string }[];
  isLoading?: boolean;
  onInputChange: <K extends keyof CreateRequirementRequest>(
    field: K,
    value: CreateRequirementRequest[K]
  ) => void;
}

export default function ReferenceFrameworkFields({
  formData,
  errors,
  frameworkOptions,
  isLoading = false,
  onInputChange,
}: ReferenceFrameworkFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="reference" className="text-sm font-medium text-gray-900">
          Reference <span className="text-red-500">*</span>
        </Label>
        <Input
          id="reference"
          type="text"
          value={formData.reference}
          onChange={(e) => onInputChange("reference", e.target.value)}
          placeholder="e.g., REQ-001"
          className={`w-full h-12 rounded-lg border px-4 ${
            errors.reference ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.reference && (
          <p className="text-sm text-red-500 mt-1">{errors.reference[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="framework_id"
          className="text-sm font-medium text-gray-900"
        >
          Framework <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.framework_id ? String(formData.framework_id) : ""}
          onValueChange={(value) => onInputChange("framework_id", Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger
            className={`w-full ${errors.framework_id ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select framework" />
          </SelectTrigger>
          <SelectContent>
            {frameworkOptions.length > 0 ? (
              frameworkOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-frameworks" disabled>
                No frameworks found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.framework_id && (
          <p className="text-sm text-red-500 mt-1">{errors.framework_id[0]}</p>
        )}
      </div>
    </div>
  );
}

