"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAgreementMutation, CreateAgreementData } from "@/app/lib/features/agreementsApi";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";

interface AgreementModalFormProps {
  onSuccess?: (agreement: any) => void;
  onCancel?: () => void;
}

const AgreementModalForm: React.FC<AgreementModalFormProps> = ({ onSuccess, onCancel }) => {
  const [createAgreement, { isLoading }] = useCreateAgreementMutation();
  const { data: vendorsData, isLoading: isVendorsLoading } = useGetVendorsQuery({ per_page: 1000 });

  const [form, setForm] = useState<Partial<CreateAgreementData>>({
    agreement_type: "msa",
    status: "draft",
  });
  const [effectiveFrom, setEffectiveFrom] = useState<string>("");
  const [effectiveTo, setEffectiveTo] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const vendorOptions = (vendorsData?.data || []).map((v: any) => ({ id: v.id, label: v.vendor_name, value: String(v.id) }));

  const validate = (): boolean => {
    const e: Record<string, string[]> = {};
    if (!form.vendor_id) e.vendor_id = ["Vendor is required"];
    if (!form.agreement_type) e.agreement_type = ["Type is required"];
    if (!form.status) e.status = ["Status is required"];
    if (!effectiveFrom) e.effective_from = ["Effective from is required"];
    if (!effectiveTo) e.effective_to = ["Effective to is required"];
    if (effectiveFrom && effectiveTo && new Date(effectiveFrom) >= new Date(effectiveTo)) {
      e.effective_to = ["Must be after effective from"];
    }
    if (!form.doc_ref?.trim()) e.doc_ref = ["Document URL is required"];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setErrors({});
    if (!validate()) return;
    try {
      const payload: CreateAgreementData = {
        vendor_id: Number(form.vendor_id),
        agreement_type: form.agreement_type as any,
        status: form.status as any,
        effective_from: new Date(effectiveFrom).toISOString(),
        effective_to: new Date(effectiveTo).toISOString(),
        doc_ref: form.doc_ref!.trim(),
      };
      const created = await createAgreement(payload).unwrap();
      onSuccess?.(created);
    } catch (err: any) {
      if (err?.data?.errors) setErrors(err.data.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, msgs]) => (
                <li key={field}>
                  <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {msgs[0]}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Vendor <span className="text-red-500">*</span></Label>
        <SelectWithInlineCreate
          value={form.vendor_id ? String(form.vendor_id) : ""}
          onValueChange={(v) => setForm((p) => ({ ...p, vendor_id: Number(v) }))}
          options={vendorOptions}
          isLoading={isVendorsLoading}
          isEmpty={!isVendorsLoading && vendorOptions.length === 0}
          entityName="Vendor"
          modalForm={VendorModalForm}
          canCreate={true}
          placeholder={isVendorsLoading ? "Loading vendors..." : "Select vendor"}
          error={!!errors.vendor_id}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Agreement Type <span className="text-red-500">*</span></Label>
          <Select value={String(form.agreement_type)} onValueChange={(v) => setForm((p) => ({ ...p, agreement_type: v as any }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="msa">MSA</SelectItem>
              <SelectItem value="dpa">DPA</SelectItem>
              <SelectItem value="order_form">Order Form</SelectItem>
              <SelectItem value="addendum">Addendum</SelectItem>
              <SelectItem value="sla">SLA</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status <span className="text-red-500">*</span></Label>
          <Select value={String(form.status)} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="lapsed">Lapsed</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Effective From <span className="text-red-500">*</span></Label>
          <Input type="datetime-local" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className={errors.effective_from ? "border-destructive" : ""} />
        </div>
        <div className="space-y-2">
          <Label>Effective To <span className="text-red-500">*</span></Label>
          <Input type="datetime-local" value={effectiveTo} onChange={(e) => setEffectiveTo(e.target.value)} className={errors.effective_to ? "border-destructive" : ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Document URL <span className="text-red-500">*</span></Label>
        <Input value={form.doc_ref || ""} onChange={(e) => setForm((p) => ({ ...p, doc_ref: e.target.value }))} placeholder="https://example.com/agreement.pdf" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" className="bg-[#4FD58F] hover:bg-[#3fc77f]" disabled={isLoading}>{isLoading ? "Creating..." : "Create Agreement"}</Button>
      </div>
    </form>
  );
};

export default AgreementModalForm;


