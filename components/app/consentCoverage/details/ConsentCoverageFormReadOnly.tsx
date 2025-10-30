"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { ConsentCoverage } from "@/app/lib/features/consentCoverageApi";
import { Progress } from "@/components/ui/progress";

interface ConsentCoverageFormReadOnlyProps {
  coverage: ConsentCoverage;
}

const ConsentCoverageFormReadOnly: React.FC<ConsentCoverageFormReadOnlyProps> = ({ coverage }) => {
  const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
    <div className="space-y-2">
      <Label className="text-[#667085]">{label}</Label>
      <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
        {value !== null && value !== undefined ? value : "—"}
      </div>
    </div>
  );

  const getCoverageColor = (pct: number) => {
    if (pct >= 80) return "text-[#039855]";
    if (pct >= 50) return "text-[#F79009]";
    return "text-[#F04438]";
  };

  return (
    <div className="space-y-6">
      {/* Dataset & Snapshot Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Dataset & Snapshot Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Dataset ID" value={coverage.dataset_id} />
          {coverage.dataset_name && <ReadOnlyField label="Dataset Name" value={coverage.dataset_name} />}
          {coverage.snapshot_id && <ReadOnlyField label="Snapshot ID" value={coverage.snapshot_id} />}
          {coverage.snapshot_version_tag && <ReadOnlyField label="Snapshot Version" value={coverage.snapshot_version_tag} />}
        </div>
      </div>

      {/* Policy Context */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Policy Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Purpose" value={coverage.purpose?.join(", ")} />
          <ReadOnlyField label="Jurisdiction" value={coverage.jurisdiction} />
          <ReadOnlyField label="As Of Date" value={new Date(coverage.as_of).toLocaleString()} />
        </div>
      </div>

      {/* Coverage Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Coverage Metrics</h3>

        {/* Coverage Percentage - Prominent Display */}
        <div className="p-4 bg-gradient-to-r from-[#F9FAFB] to-white border border-[#E4E7EC] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-[#667085] text-base">Coverage Percentage</Label>
            <span className={`font-bold text-2xl ${getCoverageColor(coverage.coverage_pct)}`}>
              {coverage.coverage_pct}%
            </span>
          </div>
          <Progress value={coverage.coverage_pct} className="h-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReadOnlyField label="Total Subjects" value={coverage.subjects_total.toLocaleString()} />
          <ReadOnlyField label="Subjects with Valid Consent" value={coverage.subjects_with_valid_consent.toLocaleString()} />
          <ReadOnlyField
            label="Subjects without Consent"
            value={(coverage.subjects_total - coverage.subjects_with_valid_consent).toLocaleString()}
          />
        </div>

        <ReadOnlyField label="Evidence Reference" value={coverage.evidence_ref} />
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={new Date(coverage.created_at).toLocaleString()} />
          <ReadOnlyField
            label="Updated At"
            value={coverage.updated_at ? new Date(coverage.updated_at).toLocaleString() : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsentCoverageFormReadOnly;

