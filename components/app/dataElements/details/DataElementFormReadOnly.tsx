"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DataElement } from "@/app/lib/features/dataElementsApi";

interface DataElementFormReadOnlyProps {
  element: DataElement;
}

const DataElementFormReadOnly: React.FC<DataElementFormReadOnlyProps> = ({ element }) => {
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
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Element Name" value={element.name} />
          <ReadOnlyField label="Data Type" value={element.data_type} />
          <ReadOnlyField label="Format" value={element.format} />
          <ReadOnlyField label="Owner Team" value={element.owner_team} />
        </div>
        <ReadOnlyField label="Business Definition" value={element.business_definition} />
      </div>

      {/* Classification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#667085]">Sensitivity</Label>
            <div className="flex gap-2">
              <Badge variant={element.sensitivity === "Restricted" || element.sensitivity === "Confidential" ? "destructive" : "light"}>
                {element.sensitivity}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#667085]">PII Flag</Label>
            <div className="flex gap-2">
              <Badge variant={element.pii_flag === "Yes" ? "destructive" : "light"}>
                {element.pii_flag}
              </Badge>
            </div>
          </div>

          {element.personal_data_category && (
            <ReadOnlyField label="Personal Data Category" value={element.personal_data_category} />
          )}

          <div className="space-y-2">
            <Label className="text-[#667085]">Special Category Flag</Label>
            <div className="flex gap-2">
              <Badge variant={element.special_category_flag === "Yes" ? "destructive" : "light"}>
                {element.special_category_flag}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* CDE Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Critical Data Element (CDE)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#667085]">CDE Flag</Label>
            <div className="flex gap-2">
              <Badge variant={element.cde_flag === "Yes" ? "default" : "light"}>
                {element.cde_flag}
              </Badge>
            </div>
          </div>

          {element.cde_category && (
            <ReadOnlyField label="CDE Category" value={element.cde_category} />
          )}
        </div>
      </div>

      {/* Optional References */}
      {(element.quality_rules_ref || element.catalog_column_id) && (
        <div className="space-y-4">
          <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Optional References</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {element.quality_rules_ref && <ReadOnlyField label="Quality Rules Reference" value={element.quality_rules_ref} />}
            {element.catalog_column_id && <ReadOnlyField label="Catalog Column ID" value={element.catalog_column_id} />}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={new Date(element.created_at).toLocaleString()} />
          <ReadOnlyField label="Updated At" value={new Date(element.updated_at).toLocaleString()} />
        </div>
      </div>
    </div>
  );
};

export default DataElementFormReadOnly;

