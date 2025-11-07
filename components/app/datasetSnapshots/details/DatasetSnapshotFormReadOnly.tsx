"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatasetSnapshot } from "@/app/lib/features/datasetSnapshotsApi";

interface DatasetSnapshotFormReadOnlyProps {
  snapshot: DatasetSnapshot;
}

const ReadonlyField: React.FC<{ label: string; value?: string | number | null; placeholder?: string }> = ({ label, value, placeholder }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value ?? ""} placeholder={placeholder} readOnly disabled />
  </div>
);

const DatasetSnapshotFormReadOnly: React.FC<DatasetSnapshotFormReadOnlyProps> = ({ snapshot }) => {
  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Snapshot Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadonlyField label="Dataset ID" value={snapshot.dataset_id} />
          <ReadonlyField label="Version Tag" value={snapshot.version_tag} />
          <ReadonlyField label="Time Range Start" value={snapshot.time_range_start} />
          <ReadonlyField label="Time Range End" value={snapshot.time_range_end} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadonlyField label="Row Count" value={snapshot.row_count ?? ""} />
          <ReadonlyField label="PII Element Count" value={snapshot.pii_element_count ?? ""} />
          <ReadonlyField label="Special Category Element Count" value={snapshot.special_category_element_count ?? ""} />
          <ReadonlyField label="Quality Checksums" value={snapshot.quality_checksums ?? ""} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Privacy & Storage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadonlyField label="Residency Zone" value={snapshot.residency_zone} />
          <ReadonlyField label="Storage URI" value={snapshot.storage_uri} />
          <ReadonlyField label="Masking/Anonymization Method" value={snapshot.masking_anonymization_method ?? ""} />
          <ReadonlyField label="Privacy Transform Evidence Reference" value={snapshot.privacy_transform_evidence_ref ?? ""} />
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadonlyField label="Created At" value={snapshot.created_at ? new Date(snapshot.created_at).toLocaleString() : ""} />
        </div>
      </div>
    </div>
  );
};

export default DatasetSnapshotFormReadOnly;


