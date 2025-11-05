"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateAiAssetData } from "@/app/lib/features/aiAssetsApi";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import { useGetAgreementsQuery } from "@/app/lib/features/agreementsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";
import AgreementModalForm from "@/components/app/agreements/create/AgreementModalForm";

interface AiAssetFormProps {
  formData: CreateAiAssetData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAiAssetData>>;
  errors: Record<string, string[]>;
}

const AiAssetForm: React.FC<AiAssetFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateAiAssetData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Vendors
  const { data: vendorsData, isLoading: isVendorsLoading } = useGetVendorsQuery({ per_page: 1000 });
  const vendorOptions = (vendorsData?.data || []).map((v: any) => ({ id: v.id, label: v.vendor_name, value: String(v.id) }));

  // Agreements filtered by vendor when selected
  const vendorIdNumber = formData.vendor_id ?? undefined;
  const { data: agreementsData, isLoading: isAgreementsLoading } = useGetAgreementsQuery(
    vendorIdNumber ? { per_page: 1000, vendor_id: vendorIdNumber } : { per_page: 1000 }
  );
  const agreementOptions = (agreementsData?.data || []).map((a: any) => ({ id: a.id, label: `#${a.id} • ${a.agreement_type?.toUpperCase?.() || "Agreement"}`, value: String(a.id) }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Vendor</Label>
        <SelectWithInlineCreate
          value={formData.vendor_id ? String(formData.vendor_id) : ""}
          onValueChange={(value) => handleChange("vendor_id", value ? Number(value) : null)}
          placeholder={isVendorsLoading ? "Loading vendors..." : "Select vendor"}
          options={vendorOptions}
          isLoading={isVendorsLoading}
          isEmpty={!isVendorsLoading && vendorOptions.length === 0}
          entityName="Vendor"
          modalForm={VendorModalForm}
          canCreate={true}
          error={!!errors.vendor_id}
        />
        {errors.vendor_id && <p className="text-sm text-destructive">{errors.vendor_id[0]}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vendor Effective From</Label>
          <Input
            type="datetime-local"
            value={formData.vendor_effective_from ?? ""}
            onChange={(e) => handleChange("vendor_effective_from", e.target.value || null)}
            className={errors.vendor_effective_from ? "border-destructive" : ""}
          />
          {errors.vendor_effective_from && (
            <p className="text-sm text-destructive">{errors.vendor_effective_from[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Vendor Effective To</Label>
          <Input
            type="datetime-local"
            value={formData.vendor_effective_to ?? ""}
            onChange={(e) => handleChange("vendor_effective_to", e.target.value || null)}
            className={errors.vendor_effective_to ? "border-destructive" : ""}
          />
          {errors.vendor_effective_to && (
            <p className="text-sm text-destructive">{errors.vendor_effective_to[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vendor Agreement</Label>
          <SelectWithInlineCreate
            value={formData.vendor_agreement_id ? String(formData.vendor_agreement_id) : ""}
            onValueChange={(value) => handleChange("vendor_agreement_id", value ? Number(value) : null)}
            placeholder={isAgreementsLoading ? "Loading agreements..." : "Select agreement"}
            options={agreementOptions}
            isLoading={isAgreementsLoading}
            isEmpty={!isAgreementsLoading && agreementOptions.length === 0}
            entityName="Agreement"
            modalForm={AgreementModalForm}
            canCreate={true}
            error={!!errors.vendor_agreement_id}
          />
          {errors.vendor_agreement_id && (
            <p className="text-sm text-destructive">{errors.vendor_agreement_id[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Vendor Assessment ID</Label>
          <Input
            type="number"
            value={formData.vendor_assessment_id ?? ""}
            onChange={(e) => handleChange("vendor_assessment_id", e.target.value ? Number(e.target.value) : null)}
            className={errors.vendor_assessment_id ? "border-destructive" : ""}
          />
          {errors.vendor_assessment_id && (
            <p className="text-sm text-destructive">{errors.vendor_assessment_id[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiAssetForm;


