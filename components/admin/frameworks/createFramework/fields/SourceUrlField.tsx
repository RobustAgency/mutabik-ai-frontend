"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateFrameworkRequest } from "@/interfaces/Framework";

interface SourceUrlFieldProps {
  formData: CreateFrameworkRequest;
  errors: Record<string, string[]>;
  onInputChange: <K extends keyof CreateFrameworkRequest>(
    field: K,
    value: CreateFrameworkRequest[K]
  ) => void;
}

export default function SourceUrlField({
  formData,
  errors,
  onInputChange,
}: SourceUrlFieldProps) {
  return (
    <div>
      <Label className="text-[#171717] text-sm font-medium" htmlFor="source_url">
        Source URL <span className="text-red-500">*</span>
      </Label>
      <Input
        id="source_url"
        type="url"
        placeholder="https://example.com"
        value={formData.source_url}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onInputChange("source_url", e.target.value)
        }
        className={`mt-1 ${errors.source_url ? "border-red-500" : ""}`}
        required
      />
      {errors.source_url && (
        <p className="text-sm text-red-500 mt-1">{errors.source_url[0]}</p>
      )}
    </div>
  );
}

