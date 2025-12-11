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
import { CreateFrameworkRequest } from "@/interfaces/Framework";

interface StatusEffectiveDateFieldsProps {
  formData: CreateFrameworkRequest;
  errors: Record<string, string[]>;
  onInputChange: <K extends keyof CreateFrameworkRequest>(
    field: K,
    value: CreateFrameworkRequest[K]
  ) => void;
}

export default function StatusEffectiveDateFields({
  formData,
  errors,
  onInputChange,
}: StatusEffectiveDateFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-[#171717] text-sm font-medium" htmlFor="status">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          key={`status-${formData.status || "none"}`}
          value={formData.status}
          onValueChange={(value) =>
            onInputChange("status", value as CreateFrameworkRequest["status"])
          }
        >
          <SelectTrigger
            className={`mt-1 w-full ${errors.status ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-500 mt-1">{errors.status[0]}</p>
        )}
      </div>
      <div>
        <Label
          className="text-[#171717] text-sm font-medium"
          htmlFor="effective_date"
        >
          Effective Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="effective_date"
          type="date"
          value={formData.effective_date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange("effective_date", e.target.value)
          }
          className={`mt-1 ${errors.effective_date ? "border-red-500" : ""}`}
        />
        {errors.effective_date && (
          <p className="text-sm text-red-500 mt-1">
            {errors.effective_date[0]}
          </p>
        )}
      </div>
    </div>
  );
}

