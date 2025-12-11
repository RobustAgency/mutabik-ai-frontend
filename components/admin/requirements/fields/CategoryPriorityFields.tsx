"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateRequirementRequest,
  RequirementCategory,
  RequirementPriority,
} from "@/interfaces/Requirement";

interface CategoryPriorityFieldsProps {
  formData: CreateRequirementRequest;
  errors: Record<string, string[]>;
  categoryOptions: { value: RequirementCategory; label: string }[];
  priorityOptions: { value: RequirementPriority; label: string }[];
  isLoading?: boolean;
  onInputChange: <K extends keyof CreateRequirementRequest>(
    field: K,
    value: CreateRequirementRequest[K]
  ) => void;
}

export default function CategoryPriorityFields({
  formData,
  errors,
  categoryOptions,
  priorityOptions,
  isLoading = false,
  onInputChange,
}: CategoryPriorityFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select
          key={`category-${formData.category || "none"}`}
          value={formData.category}
          onValueChange={(value) =>
            onInputChange("category", value as RequirementCategory)
          }
          disabled={isLoading}
        >
          <SelectTrigger
            className={`w-full ${errors.category ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">{errors.category[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Priority <span className="text-red-500">*</span>
        </Label>
        <Select
          key={`priority-${formData.priority || "none"}`}
          value={formData.priority}
          onValueChange={(value) =>
            onInputChange("priority", value as RequirementPriority)
          }
          disabled={isLoading}
        >
          <SelectTrigger
            className={`w-full ${errors.priority ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-red-500 mt-1">{errors.priority[0]}</p>
        )}
      </div>
    </div>
  );
}

