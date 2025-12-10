"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateFrameworkRequest } from "@/interfaces/Framework";

interface NameVersionFieldsProps {
  formData: CreateFrameworkRequest;
  errors: Record<string, string[]>;
  onInputChange: <K extends keyof CreateFrameworkRequest>(
    field: K,
    value: CreateFrameworkRequest[K]
  ) => void;
}

export default function NameVersionFields({
  formData,
  errors,
  onInputChange,
}: NameVersionFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-[#171717] text-sm font-medium" htmlFor="name">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter framework name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange("name", e.target.value)
          }
          className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
        )}
      </div>
      <div>
        <Label className="text-[#171717] text-sm font-medium" htmlFor="version">
          Version <span className="text-red-500">*</span>
        </Label>
        <Input
          id="version"
          type="text"
          placeholder="e.g., 2024"
          value={formData.version}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange("version", e.target.value)
          }
          className={`mt-1 ${errors.version ? "border-red-500" : ""}`}
          required
        />
        {errors.version && (
          <p className="text-sm text-red-500 mt-1">{errors.version[0]}</p>
        )}
      </div>
    </div>
  );
}

