"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";

export const PrivacyMetricsStep: React.FC = () => {
  const {
    register,
  } = useFormContext<DatasetSnapshotFormData>();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Privacy Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PII Element Count */}
          <div className="space-y-2">
            <Label htmlFor="pii_element_count">PII Element Count</Label>
            <Input
              id="pii_element_count"
              type="number"
              {...register("pii_element_count", { valueAsNumber: true, setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              placeholder="e.g., 12"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">Number of columns containing personal data</p>
          </div>

          {/* Consent Coverage at Creation */}
          <div className="space-y-2">
            <Label htmlFor="consent_coverage_at_creation">Consent Coverage at Creation</Label>
            <Input
              id="consent_coverage_at_creation"
              type="number"
              min="0"
              max="100"
              {...register("consent_coverage_at_creation", { valueAsNumber: true, setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              placeholder="e.g., 95"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">% at time of snapshot creation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

