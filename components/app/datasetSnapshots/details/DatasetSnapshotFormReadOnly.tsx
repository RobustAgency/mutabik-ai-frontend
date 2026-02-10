"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { DatasetSnapshot } from "@/app/lib/features/datasetSnapshotsApi";

interface DatasetSnapshotFormReadOnlyProps {
  snapshot: DatasetSnapshot;
}

const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
  <div className="space-y-2">
    <Label className="text-[#667085]">{label}</Label>
    <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
      {value !== null && value !== undefined ? value : "—"}
    </div>
  </div>
);

const formatEnumValue = (value: string | undefined | null): string => {
  if (!value) return "—";
  return value.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const DatasetSnapshotFormReadOnly: React.FC<DatasetSnapshotFormReadOnlyProps> = ({ snapshot }) => {
  return (
    <div className="space-y-6">
      {/* Snapshot Identification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Snapshot Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snapshot.display_id && <ReadOnlyField label="Display ID" value={snapshot.display_id} />}
          <ReadOnlyField label="Version Tag" value={snapshot.version_tag} />
          {snapshot.description && <ReadOnlyField label="Description" value={snapshot.description} />}
          {snapshot.supersedes_snapshot_id && <ReadOnlyField label="Supersedes Snapshot ID" value={snapshot.supersedes_snapshot_id} />}
          {snapshot.dataset?.name && <ReadOnlyField label="Dataset" value={snapshot.dataset.name} />}
          <ReadOnlyField label="Dataset ID" value={snapshot.dataset_id} />
          <ReadOnlyField label="Time Range Start" value={snapshot.time_range_start ? new Date(snapshot.time_range_start).toLocaleDateString() : null} />
          <ReadOnlyField label="Time Range End" value={snapshot.time_range_end ? new Date(snapshot.time_range_end).toLocaleDateString() : null} />
        </div>
      </div>

      {/* Data Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Row Count" value={snapshot.row_count?.toLocaleString()} />
          {snapshot.file_count !== null && snapshot.file_count !== undefined && (
            <ReadOnlyField label="File Count" value={snapshot.file_count} />
          )}
          {snapshot.total_size !== null && snapshot.total_size !== undefined && (
            <ReadOnlyField label="Total Size" value={`${snapshot.total_size.toLocaleString()} ${snapshot.size_unit || ''}`} />
          )}
          <ReadOnlyField label="File Format" value={formatEnumValue(snapshot.file_format)} />
          {snapshot.pii_element_count !== null && snapshot.pii_element_count !== undefined && (
            <ReadOnlyField label="PII Element Count" value={snapshot.pii_element_count} />
          )}
          {snapshot.consent_coverage_at_creation !== null && snapshot.consent_coverage_at_creation !== undefined && (
            <ReadOnlyField label="Consent Coverage at Creation (%)" value={`${snapshot.consent_coverage_at_creation}%`} />
          )}
        </div>
      </div>

      {/* Storage & Compression */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Storage & Compression</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Residency Zone" value={snapshot.residency_zone} />
          <ReadOnlyField label="Storage URI" value={snapshot.storage_uri} />
          {snapshot.storage_tier && <ReadOnlyField label="Storage Tier" value={formatEnumValue(snapshot.storage_tier)} />}
          {snapshot.compression && <ReadOnlyField label="Compression" value={formatEnumValue(snapshot.compression)} />}
          <ReadOnlyField label="Encryption Status" value={formatEnumValue(snapshot.encryption_status)} />
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Privacy & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snapshot.masking_method_applied && (
            <ReadOnlyField label="Masking Method Applied" value={formatEnumValue(snapshot.masking_method_applied)} />
          )}
          {snapshot.quality_checksums && <ReadOnlyField label="Quality Checksums" value={snapshot.quality_checksums} />}
          {snapshot.created_by_system !== null && snapshot.created_by_system !== undefined && (
            <ReadOnlyField label="Created by System" value={snapshot.created_by_system ? "Yes" : "No"} />
          )}
          {snapshot.approved_by && <ReadOnlyField label="Approved By" value={formatEnumValue(snapshot.approved_by)} />}
          {snapshot.expiration_date && (
            <ReadOnlyField label="Expiration Date" value={new Date(snapshot.expiration_date).toLocaleDateString()} />
          )}
          <ReadOnlyField label="Status" value={formatEnumValue(snapshot.status)} />
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={snapshot.created_at ? new Date(snapshot.created_at).toLocaleString() : null} />
          <ReadOnlyField label="Updated At" value={snapshot.updated_at ? new Date(snapshot.updated_at).toLocaleString() : null} />
        </div>
      </div>
    </div>
  );
};

export default DatasetSnapshotFormReadOnly;
