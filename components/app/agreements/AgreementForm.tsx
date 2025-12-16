"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";

export interface AgreementFormData {
  vendor_id: string;
  agreement_type: string;
  status: string;
  training_opt_out: string;
  audit_rights: string;
  transfer_mechanism: string;
  doc_ref: string;
  availability_target_pct: string;
  latency_p95_ms: string;
  support_tier: string;
  breach_definition: string;
  credit_schedule_ref: string;
  monitoring_ref: string;
}

interface AgreementFormProps {
  form: AgreementFormData;
  setForm: React.Dispatch<React.SetStateAction<AgreementFormData>>;
  effectiveFrom: Date | undefined;
  setEffectiveFrom: (date: Date | undefined) => void;
  effectiveTo: Date | undefined;
  setEffectiveTo: (date: Date | undefined) => void;
  validationErrors: Record<string, string[]>;
  vendorsData?: { data?: Array<{ id: number; vendor_name: string }> };
  isLoadingVendors?: boolean;
}

const AgreementForm: React.FC<AgreementFormProps> = ({
  form,
  setForm,
  effectiveFrom,
  setEffectiveFrom,
  effectiveTo,
  setEffectiveTo,
  validationErrors,
  vendorsData,
  isLoadingVendors = false,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const vendorOptions = (vendorsData?.data || []).map((vendor) => ({
    id: vendor.id,
    label: vendor.vendor_name,
    value: String(vendor.id),
  }));

  return (
    <div className="space-y-10 w-full">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vendor <span className="text-red-500">*</span></Label>
            <SelectWithInlineCreate
              key={`vendor_id-${form.vendor_id ?? 'none'}`}
              value={form.vendor_id}
              onValueChange={(v) => setForm((p) => ({ ...p, vendor_id: v }))}
              options={vendorOptions}
              isLoading={isLoadingVendors}
              isEmpty={!isLoadingVendors && (!vendorsData?.data || vendorsData.data.length === 0)}
              entityName="Vendor"
              modalForm={VendorModalForm}
              placeholder="Select vendor"
              error={!!validationErrors.vendor_id}
            />
            {validationErrors.vendor_id && (
              <p className="text-sm text-destructive">{validationErrors.vendor_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Agreement Type <span className="text-red-500">*</span></Label>
            <Select
              key={`agreement_type-${form.agreement_type ?? 'none'}`}
              value={form.agreement_type}
              onValueChange={(v) => setForm((p) => ({ ...p, agreement_type: v }))}>
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
            {validationErrors.agreement_type && (
              <p className="text-sm text-destructive">{validationErrors.agreement_type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status <span className="text-red-500">*</span></Label>
            <Select
              key={`status-${form.status ?? 'none'}`}
              value={form.status}
              onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="lapsed">Lapsed</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.status && (
              <p className="text-sm text-destructive">{validationErrors.status[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Effective From <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !effectiveFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {effectiveFrom ? format(effectiveFrom, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={effectiveFrom}
                  onSelect={setEffectiveFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {validationErrors.effective_from && (
              <p className="text-sm text-destructive">{validationErrors.effective_from[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Effective To <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !effectiveTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {effectiveTo ? format(effectiveTo, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={effectiveTo}
                  onSelect={setEffectiveTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {validationErrors.effective_to && (
              <p className="text-sm text-destructive">{validationErrors.effective_to[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc_ref">Document URL <span className="text-red-500">*</span></Label>
            <Input
              id="doc_ref"
              name="doc_ref"
              value={form.doc_ref}
              onChange={onChange}
              placeholder="https://example.com/agreement.pdf"
              className={validationErrors.doc_ref ? "border-destructive" : ""}
            />
            {validationErrors.doc_ref && (
              <p className="text-sm text-destructive">{validationErrors.doc_ref[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Compliance Details */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Compliance Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Training Opt Out</Label>
            <Select
              key={`training_opt_out-${form.training_opt_out ?? 'none'}`}
              value={form.training_opt_out}
              onValueChange={(v) => setForm((p) => ({ ...p, training_opt_out: v }))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="not_applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.training_opt_out && (
              <p className="text-sm text-destructive">{validationErrors.training_opt_out[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Audit Rights</Label>
            <Select
              key={`audit_rights-${form.audit_rights ?? 'none'}`}
              value={form.audit_rights}
              onValueChange={(v) => setForm((p) => ({ ...p, audit_rights: v }))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.audit_rights && (
              <p className="text-sm text-destructive">{validationErrors.audit_rights[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Transfer Mechanism</Label>
            <Select
              key={`transfer_mechanism-${form.transfer_mechanism ?? 'none'}`}
              value={form.transfer_mechanism}
              onValueChange={(v) => setForm((p) => ({ ...p, transfer_mechanism: v }))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="adequacy">Adequacy</SelectItem>
                <SelectItem value="sccs">SCCs</SelectItem>
                <SelectItem value="bcrs">BCRs</SelectItem>
                <SelectItem value="dpa_addendum">DPA Addendum</SelectItem>
                <SelectItem value="derogation">Derogation</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.transfer_mechanism && (
              <p className="text-sm text-destructive">{validationErrors.transfer_mechanism[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* SLA Terms - Only show when agreement type is SLA */}
      {form.agreement_type === "sla" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
            SLA Terms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availability_target_pct">Availability Target %</Label>
              <Input
                id="availability_target_pct"
                name="availability_target_pct"
                value={form.availability_target_pct}
                onChange={onChange}
                placeholder="99.9"
                className={validationErrors.availability_target_pct ? "border-destructive" : ""}
              />
              {validationErrors.availability_target_pct && (
                <p className="text-sm text-destructive">{validationErrors.availability_target_pct[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="latency_p95_ms">Latency p95 (ms)</Label>
              <Input
                id="latency_p95_ms"
                name="latency_p95_ms"
                value={form.latency_p95_ms}
                onChange={onChange}
                placeholder="200"
                className={validationErrors.latency_p95_ms ? "border-destructive" : ""}
              />
              {validationErrors.latency_p95_ms && (
                <p className="text-sm text-destructive">{validationErrors.latency_p95_ms[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="support_tier">Support Tier</Label>
              <Input
                id="support_tier"
                name="support_tier"
                value={form.support_tier}
                onChange={onChange}
                placeholder="Premium"
                className={validationErrors.support_tier ? "border-destructive" : ""}
              />
              {validationErrors.support_tier && (
                <p className="text-sm text-destructive">{validationErrors.support_tier[0]}</p>
              )}
            </div>

            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="breach_definition">Breach Definition</Label>
              <Input
                id="breach_definition"
                name="breach_definition"
                value={form.breach_definition}
                onChange={onChange}
                placeholder="Service unavailable for more than 1 hour"
                className={validationErrors.breach_definition ? "border-destructive" : ""}
              />
              {validationErrors.breach_definition && (
                <p className="text-sm text-destructive">{validationErrors.breach_definition[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_schedule_ref">Credit Schedule Ref</Label>
              <Input
                id="credit_schedule_ref"
                name="credit_schedule_ref"
                value={form.credit_schedule_ref}
                onChange={onChange}
                placeholder="SLA-CREDIT-2024"
                className={validationErrors.credit_schedule_ref ? "border-destructive" : ""}
              />
              {validationErrors.credit_schedule_ref && (
                <p className="text-sm text-destructive">{validationErrors.credit_schedule_ref[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monitoring_ref">Monitoring Ref</Label>
              <Input
                id="monitoring_ref"
                name="monitoring_ref"
                value={form.monitoring_ref}
                onChange={onChange}
                placeholder="MON-2024"
                className={validationErrors.monitoring_ref ? "border-destructive" : ""}
              />
              {validationErrors.monitoring_ref && (
                <p className="text-sm text-destructive">{validationErrors.monitoring_ref[0]}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementForm;

