"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateFrameworkRequest } from "@/interfaces/Framework";

interface JurisdictionsScopeFieldsProps {
  formData: CreateFrameworkRequest;
  jurisdictionInput: string;
  errors: Record<string, string[]>;
  onInputChange: <K extends keyof CreateFrameworkRequest>(
    field: K,
    value: CreateFrameworkRequest[K]
  ) => void;
  onJurisdictionInputChange: (value: string) => void;
}

export default function JurisdictionsScopeFields({
  formData,
  jurisdictionInput,
  errors,
  onInputChange,
  onJurisdictionInputChange,
}: JurisdictionsScopeFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label
          className="text-[#171717] text-sm font-medium"
          htmlFor="jurisdictions"
        >
          Jurisdictions (comma separated) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="jurisdictions"
          type="text"
          placeholder="e.g., EU, UK, US"
          value={jurisdictionInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onJurisdictionInputChange(e.target.value)
          }
          className="mt-1"
        />
        {errors.jurisdictions && (
          <p className="text-sm text-red-500 mt-1">{errors.jurisdictions[0]}</p>
        )}
      </div>
      <div>
        <Label className="text-[#171717] text-sm font-medium" htmlFor="scope">
          Scope <span className="text-red-500">*</span>
        </Label>
        <Input
          id="scope"
          type="text"
          placeholder="Enter scope"
          value={formData.scope}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange("scope", e.target.value)
          }
          className={`mt-1 ${errors.scope ? "border-red-500" : ""}`}
          required
        />
        {errors.scope && (
          <p className="text-sm text-red-500 mt-1">{errors.scope[0]}</p>
        )}
      </div>
    </div>
  );
}

