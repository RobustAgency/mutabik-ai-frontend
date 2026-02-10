"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetAgreementQuery, useUpdateAgreementMutation } from "@/app/lib/features/agreementsApi";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import {
  validateTextField,
  validateUrl,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";
import AgreementForm, { AgreementFormData } from "@/components/app/agreements/AgreementForm";

const EditAgreement: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: agreement, isLoading } = useGetAgreementQuery(id);
  const [updateAgreement, { isLoading: isSaving }] = useUpdateAgreementMutation();
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string[]>>({});

  // Fetch vendors for dropdown
  const { data: vendorsData, isLoading: isLoadingVendors } = useGetVendorsQuery({ per_page: 100 });

  const [form, setForm] = React.useState<AgreementFormData>({
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
      // Get vendor_id from agreement.vendor_id or from vendor object if available
      const vendorId = agreement.vendor_id ?? agreement.vendor?.id ?? null;
      
      setForm({
        vendor_id: vendorId ? String(vendorId) : "",
        agreement_type: agreement.agreement_type,
        status: agreement.status,
        training_opt_out: (agreement.training_opt_out as any) ?? "",
        audit_rights: (agreement.audit_rights as any) ?? "",
        transfer_mechanism: (agreement.transfer_mechanism as any) ?? "",
        doc_ref: agreement.doc_ref ?? "",
        // SLA terms removed - not in new backend structure
        availability_target_pct: "",
        latency_p95_ms: "",
        support_tier: "",
        breach_definition: "",
        credit_schedule_ref: "",
        monitoring_ref: "",
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


  // Form validation using shared utilities
  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      vendor_id: validateTextField(form.vendor_id, {
        required: true,
        messages: { required: "Vendor is required" },
      }),
      agreement_type: validateTextField(form.agreement_type, {
        required: true,
        messages: { required: "Agreement type is required" },
      }),
      status: validateTextField(form.status, {
        required: true,
        messages: { required: "Status is required" },
      }),
      doc_ref: [
        ...validateTextField(form.doc_ref, {
          required: true,
          messages: { required: "Document URL is required" },
        }),
        ...validateUrl(form.doc_ref, "Please enter a valid URL"),
      ],
    };

    if (!effectiveFrom) {
      fieldErrors.effective_from = ["Effective from date is required"];
    }
    if (!effectiveTo) {
      fieldErrors.effective_to = ["Effective to date is required"];
    }
    if (effectiveFrom && effectiveTo && effectiveFrom >= effectiveTo) {
      fieldErrors.effective_to = [
        ...(fieldErrors.effective_to ?? []),
        "Effective to date must be after effective from date",
      ];
    }

    // SLA numeric validations when applicable
    const slaNumericFields: Array<[keyof typeof form, string, number | undefined]> = [
      ["availability_target_pct", "Availability target must be between 0 and 100", form.availability_target_pct ? Number(form.availability_target_pct) : undefined],
      ["latency_p95_ms", "Latency p95 must be >= 0", form.latency_p95_ms ? Number(form.latency_p95_ms) : undefined],
    ];
    slaNumericFields.forEach(([fieldKey, message, value]) => {
      if (value !== undefined && !Number.isNaN(value)) {
        const numericErrors = validateNumericField(value, {
          min: fieldKey === "latency_p95_ms" ? 0 : 0,
          max: fieldKey === "availability_target_pct" ? 100 : undefined,
          messages: { min: message, max: message },
        });
        if (numericErrors.length) {
          fieldErrors[fieldKey] = numericErrors;
        }
      }
    });

    const errors = createValidationErrors(fieldErrors);
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

                <AgreementForm
                  form={form}
                  setForm={setForm}
                  effectiveFrom={effectiveFrom}
                  setEffectiveFrom={setEffectiveFrom}
                  effectiveTo={effectiveTo}
                  setEffectiveTo={setEffectiveTo}
                  validationErrors={validationErrors}
                  vendorsData={vendorsData}
                  isLoadingVendors={isLoadingVendors}
                />
              </>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditAgreement;


