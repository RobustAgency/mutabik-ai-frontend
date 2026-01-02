"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IncidentActionFormData } from "@/lib/schemas/incidentAction.schema";

export const AdditionalInfoStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentActionFormData>();

  const dependsOn = watch("depends_on");
  const linkedReleaseId = watch("linked_release_id");
  const evidenceLink = watch("evidence_link");

  const hasError = (fieldName: keyof IncidentActionFormData): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Additional Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Depends On */}
        <div className="space-y-2">
          <Label htmlFor="depends_on">Depends On</Label>
          <Input
            id="depends_on"
            value={dependsOn || ""}
            onChange={(e) =>
              setValue("depends_on", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Action IDs or references this action depends on"
            className={hasError("depends_on") ? "border-red-500" : ""}
          />
          {hasError("depends_on") && (
            <p className="text-sm text-red-500">{getError("depends_on")}</p>
          )}
        </div>

        {/* Linked Release ID */}
        <div className="space-y-2">
          <Label htmlFor="linked_release_id">Linked Release ID</Label>
          <Input
            id="linked_release_id"
            value={linkedReleaseId || ""}
            onChange={(e) =>
              setValue("linked_release_id", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Release used for rollback/patch"
            className={hasError("linked_release_id") ? "border-red-500" : ""}
          />
          {hasError("linked_release_id") && (
            <p className="text-sm text-red-500">
              {getError("linked_release_id")}
            </p>
          )}
        </div>

        {/* Evidence Link */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="evidence_link">Evidence Link</Label>
          <Input
            id="evidence_link"
            type="url"
            value={evidenceLink || ""}
            onChange={(e) =>
              setValue("evidence_link", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="https://example.com/evidence"
            className={hasError("evidence_link") ? "border-red-500" : ""}
          />
          {hasError("evidence_link") && (
            <p className="text-sm text-red-500">{getError("evidence_link")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

