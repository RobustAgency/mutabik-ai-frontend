"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConsentScope } from "@/app/lib/features/consentScopesApi";

interface ConsentScopeFormReadOnlyProps {
  scope: ConsentScope;
}

const ConsentScopeFormReadOnly: React.FC<ConsentScopeFormReadOnlyProps> = ({ scope }) => {
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
      {/* Dataset Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Dataset & Policy Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Dataset ID" value={scope.dataset_id} />
          {scope.dataset && <ReadOnlyField label="Dataset Name" value={scope.dataset.name} />}
          <ReadOnlyField label="Purpose" value={scope.purpose} />
        </div>
      </div>

      {/* Subject Context */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Subject Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Subject Realm" value={scope.subject_realm} />
          <ReadOnlyField label="Jurisdiction" value={scope.jurisdiction} />
        </div>
      </div>

      {/* Validity Period */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Validity Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Effective From" value={new Date(scope.effective_from).toLocaleString()} />
          {scope.effective_to && <ReadOnlyField label="Effective To" value={new Date(scope.effective_to).toLocaleString()} />}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={new Date(scope.created_at).toLocaleString()} />
          <ReadOnlyField label="Updated At" value={new Date(scope.updated_at).toLocaleString()} />
        </div>
      </div>
    </div>
  );
};

export default ConsentScopeFormReadOnly;

