"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ComplianceEvidenceFormData } from "@/lib/schemas/complianceEvidence.schema";

interface CollectionDetailsStepProps {
  sampleIdsText: string;
  userOptions: { value: string; label: string }[];
  isLoading: boolean;
  onSampleIdsChange: (text: string) => void;
}

export const CollectionDetailsStep: React.FC<CollectionDetailsStepProps> = ({
  sampleIdsText,
  userOptions,
  isLoading,
  onSampleIdsChange,
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ComplianceEvidenceFormData>();
  const watchedCollectedBy = watch("collected_by");

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sample_ids" className="text-sm font-medium text-gray-900">
          Sample IDs <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={sampleIdsText}
          onChange={(e) => onSampleIdsChange(e.target.value)}
          placeholder="Enter sample IDs separated by commas (e.g., SAMPLE_001, SAMPLE_002)"
          className={`mt-1 min-h-32 resize-none ${errors.sample_ids ? "border-red-500" : ""}`}
          disabled={isLoading}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">Enter sample IDs separated by commas</p>
        {errors.sample_ids && (
          <p className="text-sm text-red-500 mt-1">{errors.sample_ids.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="sampling_method" className="text-sm font-medium text-gray-900">
          Sampling Method <span className="text-red-500">*</span>
        </Label>
        <Input
          id="sampling_method"
          type="text"
          {...register("sampling_method")}
          placeholder="Enter sampling method"
          className={`mt-1 ${errors.sampling_method ? "border-red-500" : ""}`}
          disabled={isLoading}
        />
        {errors.sampling_method && (
          <p className="text-sm text-red-500 mt-1">{errors.sampling_method.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="collection_period_start" className="text-sm font-medium text-gray-900">
            Collection Period Start
          </Label>
          <Input
            id="collection_period_start"
            type="date"
            {...register("collection_period_start")}
            className="mt-1"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="collection_period_end" className="text-sm font-medium text-gray-900">
            Collection Period End
          </Label>
          <Input
            id="collection_period_end"
            type="date"
            {...register("collection_period_end")}
            className="mt-1"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="collected_by" className="text-sm font-medium text-gray-900">
          Collected By
        </Label>
        <Select
          value={watchedCollectedBy ? String(watchedCollectedBy) : "null"}
          onValueChange={(value) =>
            setValue("collected_by", value === "null" ? null : Number(value), { shouldValidate: true })
          }
          disabled={isLoading}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="null" value="null">None</SelectItem>
            {userOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="hash_checksum" className="text-sm font-medium text-gray-900">
          Hash Checksum <span className="text-red-500">*</span>
        </Label>
        <Input
          id="hash_checksum"
          type="text"
          {...register("hash_checksum")}
          placeholder="Enter hash checksum"
          className={`mt-1 ${errors.hash_checksum ? "border-red-500" : ""}`}
          disabled={isLoading}
        />
        {errors.hash_checksum && (
          <p className="text-sm text-red-500 mt-1">{errors.hash_checksum.message}</p>
        )}
      </div>
    </div>
  );
};

