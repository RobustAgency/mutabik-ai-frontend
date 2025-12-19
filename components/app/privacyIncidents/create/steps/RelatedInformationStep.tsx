"use client";

import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { PrivacyIncidentFormData } from "@/lib/schemas/privacyIncident.schema";
import MultiRopaSelector from "@/components/app/dataSubjectRequestAccesses/create/MultiRopaSelector";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";

export const RelatedInformationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<PrivacyIncidentFormData>();

  const thirdPartyInvolved = watch("third_party_involved");

  const { data: vendorsResponse, isLoading: isLoadingVendors } =
    useGetVendorsQuery({ per_page: 100 });

  // Ensure arrays are initialized for useFieldArray
  useEffect(() => {
    const currentAffectedSystems = watch("affected_systems");
    if (!Array.isArray(currentAffectedSystems)) {
      setValue("affected_systems", [] as string[]);
    }
    const currentEvidenceUris = watch("evidence_uris");
    if (currentEvidenceUris === null || !Array.isArray(currentEvidenceUris)) {
      setValue("evidence_uris", [] as string[]);
    }
  }, [watch, setValue]);

  const {
    fields: systemFields,
    append: appendSystem,
    remove: removeSystem,
  } = useFieldArray({
    control: control as any,
    name: "affected_systems",
  });

  const {
    fields: evidenceFields,
    append: appendEvidence,
    remove: removeEvidence,
  } = useFieldArray({
    control: control as any,
    name: "evidence_uris",
  });

  const vendors = vendorsResponse?.data || [];
  const vendorOptions = vendors.map((vendor) => ({
    id: vendor.id,
    value: vendor.id.toString(),
    label: vendor.vendor_name,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Linked Processing Activities (ROPA)</Label>
        <MultiRopaSelector
          label=""
          value={(() => {
            const value = watch("processing_activity_ids");
            return Array.isArray(value) ? value : [];
          })()}
          onValueChange={(ids) => {
            setValue("processing_activity_ids", ids.length > 0 ? ids : null, { shouldDirty: true });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Affected Systems <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          {systemFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`affected_systems.${index}` as const)}
                className={`flex-1 ${
                  errors.affected_systems?.[index] ? "border-red-500" : ""
                }`}
                placeholder="e.g., CRM, Billing, Support"
                maxLength={255}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeSystem(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSystem("")}
            className="w-full"
          >
            Add System
          </Button>
        </div>
        {errors.affected_systems && (
          <p className="text-sm text-red-500">
            {errors.affected_systems.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="third_party_involved"
            checked={thirdPartyInvolved}
            onCheckedChange={(checked) => {
              setValue("third_party_involved", checked === true);
              if (!checked) {
                setValue("vendor_id", null);
              }
            }}
          />
          <Label
            htmlFor="third_party_involved"
            className="cursor-pointer font-normal"
            onClick={() => setValue("third_party_involved", !thirdPartyInvolved)}
          >
            Third party involved
          </Label>
        </div>
      </div>

      {thirdPartyInvolved && (
        <div className="space-y-2 pl-6">
          <Label htmlFor="vendor_id">
            Vendor <span className="text-red-500">*</span>
          </Label>
          <SelectWithInlineCreate
            value={watch("vendor_id")?.toString() || ""}
            onValueChange={(value) =>
              setValue("vendor_id", value === "" ? null : Number(value))
            }
            placeholder="Select vendor"
            options={vendorOptions}
            isLoading={isLoadingVendors}
            isEmpty={vendorOptions.length === 0}
            entityName="Vendor"
            modalForm={VendorModalForm}
            canCreate={true}
            modalTitle="Create New Vendor"
            modalDescription="Add a new vendor to the system"
            error={!!errors.vendor_id}
          />
          {errors.vendor_id && (
            <p className="text-sm text-red-500">{errors.vendor_id.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Evidence URIs (Optional)</Label>
        <div className="space-y-2">
          {evidenceFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`evidence_uris.${index}` as const)}
                type="url"
                className={`flex-1 ${
                  errors.evidence_uris?.[index] ? "border-red-500" : ""
                }`}
                placeholder="https://example.com/evidence/document.pdf"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeEvidence(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendEvidence("")}
            className="w-full"
          >
            Add Evidence URI
          </Button>
        </div>
        {errors.evidence_uris && (
          <p className="text-sm text-red-500">
            {typeof errors.evidence_uris === "string"
              ? errors.evidence_uris
              : "Please provide valid URLs"}
          </p>
        )}
      </div>
    </div>
  );
};

