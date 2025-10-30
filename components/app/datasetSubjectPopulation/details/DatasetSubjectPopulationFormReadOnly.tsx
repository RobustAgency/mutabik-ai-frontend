"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DatasetSubjectPopulation } from "@/app/lib/features/datasetSubjectPopulationApi";

interface DatasetSubjectPopulationFormReadOnlyProps {
  population: DatasetSubjectPopulation;
}

const DatasetSubjectPopulationFormReadOnly: React.FC<DatasetSubjectPopulationFormReadOnlyProps> = ({ population }) => {
  const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
    <div className="space-y-2">
      <Label className="text-[#667085]">{label}</Label>
      <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
        {value !== null && value !== undefined ? value : "—"}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dataset & Snapshot Context */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Dataset & Snapshot Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Dataset ID" value={population.dataset_id} />
          {population.dataset && <ReadOnlyField label="Dataset Name" value={population.dataset.name} />}
          {population.snapshot_id && <ReadOnlyField label="Snapshot ID" value={population.snapshot_id} />}
          {population.snapshot && <ReadOnlyField label="Snapshot Version" value={population.snapshot.version_tag} />}
        </div>
      </div>

      {/* Subject Context */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Subject Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#667085]">Subject Realm</Label>
            <div className="flex gap-2">
              <Badge variant="light">{population.subject_realm}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#667085]">Jurisdiction</Label>
            <div className="flex gap-2">
              <Badge variant="outlined">{population.jurisdiction}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Population Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Population Metrics</h3>

        {/* Total Subjects - Prominent Display */}
        <div className="p-4 bg-gradient-to-r from-[#ECFDF3] to-white border border-[#039855] rounded-lg">
          <div className="flex items-center justify-between">
            <Label className="text-[#667085] text-base">Total Subjects (Denominator)</Label>
            <span className="font-bold text-3xl text-[#039855]">
              {population.subjects_total.toLocaleString()}
            </span>
          </div>
        </div>

        <ReadOnlyField label="As Of Date" value={new Date(population.as_of).toLocaleString()} />
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={new Date(population.created_at).toLocaleString()} />
          <ReadOnlyField label="Updated At" value={new Date(population.updated_at).toLocaleString()} />
        </div>
      </div>
    </div>
  );
};

export default DatasetSubjectPopulationFormReadOnly;

