"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PdpProcessingRegister } from "@/app/lib/features/pdpProcessingRegisterApi";

interface PdpProcessingRegisterFormReadOnlyProps {
  register: PdpProcessingRegister;
}

const PdpProcessingRegisterFormReadOnly: React.FC<PdpProcessingRegisterFormReadOnlyProps> = ({ register }) => {
  const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
    <div className="space-y-2">
      <Label className="text-[#667085]">{label}</Label>
      <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Processing Activity */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Processing Activity</h3>
        <div className="space-y-2">
          <ReadOnlyField label="Processing Purpose" value={register.purpose} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Controller Role" value={register.controller_role} />
          <ReadOnlyField label="Owner Team" value={register.owner_team} />
        </div>

        {register.data_subject_categories && register.data_subject_categories.length > 0 && (
          <div className="space-y-2">
            <Label className="text-[#667085]">Data Subject Categories</Label>
            <div className="flex flex-wrap gap-2">
              {register.data_subject_categories.map((cat, index) => (
                <Badge key={index} variant="light" className="bg-green-50 text-green-700 border-green-200">{cat}</Badge>
              ))}
            </div>
          </div>
        )}

        {register.personal_data_categories && register.personal_data_categories.length > 0 && (
          <div className="space-y-2">
            <Label className="text-[#667085]">Personal Data Categories</Label>
            <div className="flex flex-wrap gap-2">
              {register.personal_data_categories.map((cat, index) => (
                <Badge key={index} variant="light" className="bg-blue-50 text-blue-700 border-blue-200">{cat}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legal Basis */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Legal Basis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Lawful Basis" value={register.lawful_basis} />
          {register.lawful_basis_detail && (
            <ReadOnlyField label="Lawful Basis Detail" value={register.lawful_basis_detail} />
          )}
        </div>
      </div>

      {/* Compliance & Security */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Compliance & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="DPIA Required" value={register.dpia_required_flag} />
          <ReadOnlyField label="Status" value={register.status} />
          {register.retention_policy_ref && (
            <ReadOnlyField label="Retention Policy Reference" value={register.retention_policy_ref} />
          )}
          {register.international_transfer_ref && (
            <ReadOnlyField label="International Transfer Reference" value={register.international_transfer_ref} />
          )}
          {register.security_measures_ref && (
            <ReadOnlyField label="Security Measures Reference" value={register.security_measures_ref} />
          )}
          <ReadOnlyField label="Effective From" value={new Date(register.effective_from).toLocaleDateString()} />
          {register.effective_to && (
            <ReadOnlyField label="Effective To" value={new Date(register.effective_to).toLocaleDateString()} />
          )}
        </div>

        {register.recipients && register.recipients.length > 0 && (
          <div className="space-y-2">
            <Label className="text-[#667085]">Recipients</Label>
            <div className="flex flex-wrap gap-2">
              {register.recipients.map((recipient, index) => (
                <Badge key={index} variant="light" className="bg-purple-50 text-purple-700 border-purple-200">{recipient}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={new Date(register.created_at).toLocaleString()} />
          <ReadOnlyField label="Updated At" value={new Date(register.updated_at).toLocaleString()} />
        </div>
      </div>
    </div>
  );
};

export default PdpProcessingRegisterFormReadOnly;

