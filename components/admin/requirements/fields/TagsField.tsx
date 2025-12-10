"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TagsFieldProps {
  tagsInput: string;
  errors: Record<string, string[]>;
  isLoading?: boolean;
  onTagsInputChange: (value: string) => void;
}

export default function TagsField({
  tagsInput,
  errors,
  isLoading = false,
  onTagsInputChange,
}: TagsFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">
        Tags (comma separated)
      </Label>
      <Input
        type="text"
        value={tagsInput}
        onChange={(e) => onTagsInputChange(e.target.value)}
        placeholder="e.g., access control, audit"
        className={`w-full h-12 rounded-lg border px-4 ${
          errors.tags ? "border-red-500" : "border-gray-300"
        }`}
        disabled={isLoading}
      />
      {errors.tags && (
        <p className="text-sm text-red-500 mt-1">{errors.tags[0]}</p>
      )}
    </div>
  );
}

