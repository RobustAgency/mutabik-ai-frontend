"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { ModelDatasetLink } from "@/app/lib/features/modelDatasetLinksApi";

interface ModelDatasetLinkFormReadOnlyProps {
  link: ModelDatasetLink;
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

const ModelDatasetLinkFormReadOnly: React.FC<ModelDatasetLinkFormReadOnlyProps> = ({ link }) => {
  return (
    <div className="space-y-6">
      {/* Link Identification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Link Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {link.display_id && <ReadOnlyField label="Display ID" value={link.display_id} />}
          <ReadOnlyField 
            label="AI Model" 
            value={link.ai_model?.name || `ID: ${link.ai_model_id}`} 
          />
          <ReadOnlyField 
            label="AI Model Version" 
            value={link.ai_model_version?.version_number || `ID: ${link.ai_model_version_id}`} 
          />
          <ReadOnlyField 
            label="Dataset" 
            value={link.dataset?.name || `ID: ${link.dataset_id}`} 
          />
          {link.dataset_snapshot?.version_tag ? (
            <ReadOnlyField 
              label="Dataset Snapshot" 
              value={link.dataset_snapshot.version_tag} 
            />
          ) : link.dataset_snapshot_id ? (
            <ReadOnlyField label="Dataset Snapshot" value={`ID: ${link.dataset_snapshot_id}`} />
          ) : null}
          <ReadOnlyField label="Role" value={formatEnumValue(link.role)} />
        </div>
      </div>

      {/* Training Details */}
      {(link.rows_used || link.training_start_date || link.training_end_date || link.training_duration || link.compute_resources || link.cost) && (
        <div className="space-y-4">
          <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Training Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {link.rows_used !== null && link.rows_used !== undefined && (
              <ReadOnlyField label="Rows Used" value={link.rows_used.toLocaleString()} />
            )}
            {link.training_start_date && (
              <ReadOnlyField label="Training Start Date" value={new Date(link.training_start_date).toLocaleDateString()} />
            )}
            {link.training_end_date && (
              <ReadOnlyField label="Training End Date" value={new Date(link.training_end_date).toLocaleDateString()} />
            )}
            {link.training_duration && <ReadOnlyField label="Training Duration" value={link.training_duration} />}
            {link.compute_resources && <ReadOnlyField label="Compute Resources" value={link.compute_resources} />}
            {link.cost !== null && link.cost !== undefined && (
              <ReadOnlyField label="Cost" value={`${link.cost.toLocaleString()}`} />
            )}
          </div>
        </div>
      )}

      {/* Compliance Checks */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Compliance Checks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {link.consent_check_status && <ReadOnlyField label="Consent Check Status" value={formatEnumValue(link.consent_check_status)} />}
          <ReadOnlyField label="Cross-Border Check" value={formatEnumValue(link.cross_border_check)} />
          <ReadOnlyField label="Special Category Check" value={formatEnumValue(link.special_category_check)} />
          {link.bias_mitigation_applied !== null && link.bias_mitigation_applied !== undefined && (
            <ReadOnlyField label="Bias Mitigation Applied" value={link.bias_mitigation_applied ? "Yes" : "No"} />
          )}
        </div>
      </div>

      {/* Governance & Status */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Governance & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created By System" value={formatEnumValue(link.created_by_system)} />
          <ReadOnlyField label="Linkage Status" value={formatEnumValue(link.linkage_status)} />
          {link.business_justification && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[#667085]">Business Justification</Label>
              <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB] min-h-32">
                {link.business_justification}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={link.created_at ? new Date(link.created_at).toLocaleString() : null} />
          <ReadOnlyField label="Updated At" value={link.updated_at ? new Date(link.updated_at).toLocaleString() : null} />
        </div>
      </div>
    </div>
  );
};

export default ModelDatasetLinkFormReadOnly;

