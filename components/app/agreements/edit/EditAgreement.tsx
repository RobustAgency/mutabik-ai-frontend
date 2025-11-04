"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetAgreementQuery, useUpdateAgreementMutation } from "@/app/lib/features/agreementsApi";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import { cn } from "@/lib/utils";

const EditAgreement: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: agreement, isLoading } = useGetAgreementQuery(id);
  const [updateAgreement, { isLoading: isSaving }] = useUpdateAgreementMutation();
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string[]>>({});

  // Fetch vendors for dropdown
  const { data: vendorsData, isLoading: isLoadingVendors } = useGetVendorsQuery({ per_page: 1000 });

  const [form, setForm] = React.useState({
    vendor_id: "",
    agreement_type: "msa",
    status: "draft",
    training_opt_out: "",
    audit_rights: "",
    transfer_mechanism: "",
    doc_ref: "",
    availability_target_pct: "",
    latency_p95_ms: "",
    support_tier: "",
    breach_definition: "",
    credit_schedule_ref: "",
    monitoring_ref: "",
  });

  const [effectiveFrom, setEffectiveFrom] = React.useState<Date>();
  const [effectiveTo, setEffectiveTo] = React.useState<Date>();

  React.useEffect(() => {
    if (agreement) {
      setForm({
        vendor_id: String(agreement.vendor_id ?? ""),
        agreement_type: agreement.agreement_type,
        status: agreement.status,
        training_opt_out: (agreement.training_opt_out as any) ?? "",
        audit_rights: (agreement.audit_rights as any) ?? "",
        transfer_mechanism: (agreement.transfer_mechanism as any) ?? "",
        doc_ref: agreement.doc_ref ?? "",
        availability_target_pct: agreement.sla_terms?.availability_target_pct?.toString() ?? "",
        latency_p95_ms: agreement.sla_terms?.latency_p95_ms?.toString() ?? "",
        support_tier: agreement.sla_terms?.support_tier ?? "",
        breach_definition: agreement.sla_terms?.breach_definition ?? "",
        credit_schedule_ref: agreement.sla_terms?.credit_schedule_ref ?? "",
        monitoring_ref: agreement.sla_terms?.monitoring_ref ?? "",
      });

      // Set dates
      if (agreement.effective_from) {
        setEffectiveFrom(new Date(agreement.effective_from));
      }
      if (agreement.effective_to) {
        setEffectiveTo(new Date(agreement.effective_to));
      }
    }
  }, [agreement]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields
    if (!form.vendor_id?.trim()) {
      errors.vendor_id = ["Vendor is required"];
    }

    if (!form.agreement_type) {
      errors.agreement_type = ["Agreement type is required"];
    }

    if (!form.status) {
      errors.status = ["Status is required"];
    }

    if (!effectiveFrom) {
      errors.effective_from = ["Effective from date is required"];
    }

    if (!effectiveTo) {
      errors.effective_to = ["Effective to date is required"];
    }

    if (!form.doc_ref?.trim()) {
      errors.doc_ref = ["Document URL is required"];
    } else {
      // Basic URL validation
      try {
        new URL(form.doc_ref);
      } catch {
        errors.doc_ref = ["Please enter a valid URL"];
      }
    }

    // Validate dates
    if (effectiveFrom && effectiveTo) {
      if (effectiveFrom >= effectiveTo) {
        errors.effective_to = ["Effective to date must be after effective from date"];
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side validation
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const payload: any = {
        vendor_id: Number(form.vendor_id),
        agreement_type: form.agreement_type as any,
        status: form.status as any,
        effective_from: effectiveFrom?.toISOString(),
        effective_to: effectiveTo?.toISOString(),
        doc_ref: form.doc_ref,
      };
      if (form.training_opt_out) payload.training_opt_out = form.training_opt_out as any;
      if (form.audit_rights) payload.audit_rights = form.audit_rights as any;
      if (form.transfer_mechanism) payload.transfer_mechanism = form.transfer_mechanism as any;

      const hasSla = form.agreement_type === "sla";
      if (hasSla) {
        const sla_terms: any = {};
        if (form.availability_target_pct) sla_terms.availability_target_pct = Number(form.availability_target_pct);
        if (form.latency_p95_ms) sla_terms.latency_p95_ms = Number(form.latency_p95_ms);
        if (form.support_tier) sla_terms.support_tier = form.support_tier;
        if (form.breach_definition) sla_terms.breach_definition = form.breach_definition;
        if (form.credit_schedule_ref) sla_terms.credit_schedule_ref = form.credit_schedule_ref;
        if (form.monitoring_ref) sla_terms.monitoring_ref = form.monitoring_ref;
        payload.sla_terms = Object.keys(sla_terms).length ? sla_terms : null;
      } else {
        payload.sla_terms = null;
      }

      await updateAgreement({ id, data: payload }).unwrap();
      router.push("/core-assets/agreements");
    } catch (err: any) {
      // Handle backend validation errors
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={onSubmit}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Edit agreement
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Update agreement details and terms
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/core-assets/agreements")}>Cancel</Button>
              <Button type="submit" className="border bg-[#4FD58F] opacity-100" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button>
            </div>
          </div>
          <CardContent className="space-y-10 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-[#667085]">Loading agreement details...</p>
              </div>
            ) : (
              <>
                {/* Show validation errors */}
                {Object.keys(validationErrors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">
                        Please fix the following errors:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(validationErrors).map(([field, errors]) => (
                          <li key={field}>
                            <span className="font-medium capitalize">
                              {field.replace(/_/g, " ").replace(/\./g, " ")}:
                            </span>{" "}
                            {errors[0]}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vendor <span className="text-red-500">*</span></Label>
                      <Select
                        key={`vendor_id-${form.vendor_id ?? 'none'}`}
                        value={form.vendor_id}
                        onValueChange={(v) => setForm((p) => ({ ...p, vendor_id: v }))}
                        disabled={isLoadingVendors}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isLoadingVendors ? "Loading vendors..." : "Select vendor"} />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorsData?.data?.map((vendor) => (
                            <SelectItem key={vendor.id} value={String(vendor.id)}>
                              {vendor.vendor_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc_ref">Document URL <span className="text-red-500">*</span></Label>
                      <Input id="doc_ref" name="doc_ref" value={form.doc_ref} onChange={onChange} placeholder="https://example.com/agreement.pdf" required />
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
                    </div>
                  </div>
                </div>

                {/* SLA Terms */}
                {form.agreement_type === "sla" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                      SLA Terms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="availability_target_pct">Availability Target %</Label>
                        <Input id="availability_target_pct" name="availability_target_pct" value={form.availability_target_pct} onChange={onChange} placeholder="99.9" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="latency_p95_ms">Latency p95 (ms)</Label>
                        <Input id="latency_p95_ms" name="latency_p95_ms" value={form.latency_p95_ms} onChange={onChange} placeholder="200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support_tier">Support Tier</Label>
                        <Input id="support_tier" name="support_tier" value={form.support_tier} onChange={onChange} placeholder="Premium" />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="breach_definition">Breach Definition</Label>
                        <Input id="breach_definition" name="breach_definition" value={form.breach_definition} onChange={onChange} placeholder="Service unavailable for more than 1 hour" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credit_schedule_ref">Credit Schedule Ref</Label>
                        <Input id="credit_schedule_ref" name="credit_schedule_ref" value={form.credit_schedule_ref} onChange={onChange} placeholder="SLA-CREDIT-2024" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monitoring_ref">Monitoring Ref</Label>
                        <Input id="monitoring_ref" name="monitoring_ref" value={form.monitoring_ref} onChange={onChange} placeholder="MON-2024" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditAgreement;


