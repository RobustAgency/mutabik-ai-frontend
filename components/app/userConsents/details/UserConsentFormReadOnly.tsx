"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserConsent } from "@/app/lib/features/userConsentsApi";

interface UserConsentFormReadOnlyProps {
  consent: UserConsent;
}

const UserConsentFormReadOnly: React.FC<UserConsentFormReadOnlyProps> = ({ consent }) => {
  const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
    <div className="space-y-2">
      <Label className="text-[#667085]">{label}</Label>
      <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
        {value !== null && value !== undefined ? value : "—"}
      </div>
    </div>
  );

  const getStatusBadgeColor = (status: string) => {
    const colorMap: Record<string, string> = {
      granted: "bg-[#ECFDF3] text-[#039855]",
      denied: "bg-[#FEF3F2] text-[#F04438]",
      withdrawn: "bg-[#FEF3F2] text-[#F79009]",
      expired: "bg-[#F2F4F7] text-[#667085]",
      not_obtained: "bg-[#FEF3F2] text-[#F04438]",
    };
    return colorMap[status] || "bg-[#F2F4F7] text-[#667085]";
  };

  return (
    <div className="space-y-6">
      {/* Subject Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Subject Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Subject Key" value={consent.subject_key} />
          <ReadOnlyField label="Subject Realm" value={consent.subject_realm} />
          <ReadOnlyField label="Jurisdiction" value={consent.jurisdiction} />
        </div>
      </div>

      {/* Consent Details */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Consent Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#667085]">Consent Status</Label>
            <div className="flex gap-2">
              <Badge className={getStatusBadgeColor(consent.consent_status)}>
                {consent.consent_status}
              </Badge>
            </div>
          </div>

          <ReadOnlyField label="Legal Basis" value={consent.legal_basis} />
          <ReadOnlyField label="Source System" value={consent.source_system} />
          <ReadOnlyField label="Evidence Reference" value={consent.evidence_ref} />
        </div>

        {consent.consent_purpose && consent.consent_purpose.length > 0 && (
          <div className="space-y-2">
            <Label className="text-[#667085]">Consent Purposes</Label>
            <div className="flex flex-wrap gap-2">
              {consent.consent_purpose.map((purpose, index) => (
                <Badge key={index} variant="light">{purpose}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Validity Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Effective From" value={new Date(consent.effective_from).toLocaleString()} />
          {consent.effective_to && <ReadOnlyField label="Effective To" value={new Date(consent.effective_to).toLocaleString()} />}
          {consent.scope && <ReadOnlyField label="Scope" value={consent.scope} />}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={new Date(consent.created_at).toLocaleString()} />
          <ReadOnlyField label="Updated At" value={new Date(consent.updated_at).toLocaleString()} />
        </div>
      </div>
    </div>
  );
};

export default UserConsentFormReadOnly;

