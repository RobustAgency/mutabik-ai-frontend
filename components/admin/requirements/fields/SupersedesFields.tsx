"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRequirementRequest } from "@/interfaces/Requirement";

interface SupersedesFieldsProps {
  formData: CreateRequirementRequest;
  errors: Record<string, string[]>;
  requirementOptions: { value: string; label: string }[];
  isLoading?: boolean;
  onInputChange: <K extends keyof CreateRequirementRequest>(
    field: K,
    value: CreateRequirementRequest[K]
  ) => void;
}

export default function SupersedesFields({
  formData,
  errors,
  requirementOptions,
  isLoading = false,
  onInputChange,
}: SupersedesFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Supersedes Requirement
        </Label>
        <Select
          value={formData.supersedes_req_id ? String(formData.supersedes_req_id) : ""}
          onValueChange={(value) =>
            onInputChange("supersedes_req_id", value ? Number(value) : undefined)
          }
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select requirement" />
          </SelectTrigger>
          <SelectContent>
            {requirementOptions.length > 0 ? (
              requirementOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="__empty" disabled>
                No requirements found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.supersedes_req_id && (
          <p className="text-sm text-red-500 mt-1">
            {errors.supersedes_req_id[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Superseded By Requirement
        </Label>
        <Select
          value={
            formData.superseded_by_req_id
              ? String(formData.superseded_by_req_id)
              : ""
          }
          onValueChange={(value) =>
            onInputChange(
              "superseded_by_req_id",
              value ? Number(value) : undefined
            )
          }
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select requirement" />
          </SelectTrigger>
          <SelectContent>
            {requirementOptions.length > 0 ? (
              requirementOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="__empty" disabled>
                No requirements found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.superseded_by_req_id && (
          <p className="text-sm text-red-500 mt-1">
            {errors.superseded_by_req_id[0]}
          </p>
        )}
      </div>
    </div>
  );
}

