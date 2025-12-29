"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

export const MetadataStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  const metadata = watch("metadata");
  const metadataErrors = errors.metadata as any;

  // Initialize metadata as an object if it's null
  useEffect(() => {
    if (metadata === null || metadata === undefined) {
      setValue("metadata", {
        sub_processors_url: null,
        residency_options: null,
        websites: null,
        parent_company: null,
        metadata_notes: null,
      });
    }
  }, [metadata, setValue]);

  const hasError = (fieldName: string) =>
    metadataErrors?.[fieldName] && metadataErrors[fieldName]?.message;
  const getError = (fieldName: string) =>
    metadataErrors?.[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Metadata
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sub-processors URL */}
        <div className="space-y-2">
          <Label htmlFor="metadata.sub_processors_url">Sub-processors URL</Label>
          <Input
            id="metadata.sub_processors_url"
            {...register("metadata.sub_processors_url")}
            className={hasError("sub_processors_url") ? "border-red-500" : ""}
            placeholder="https://example.com/sub-processors"
            type="url"
          />
          {hasError("sub_processors_url") && (
            <p className="text-sm text-red-500">{getError("sub_processors_url")}</p>
          )}
        </div>

        {/* Residency Options */}
        <div className="space-y-2">
          <Label htmlFor="metadata.residency_options">Residency Options</Label>
          <Input
            id="metadata.residency_options"
            {...register("metadata.residency_options")}
            className={hasError("residency_options") ? "border-red-500" : ""}
            placeholder="EU, US-East, APAC"
          />
          {hasError("residency_options") && (
            <p className="text-sm text-red-500">{getError("residency_options")}</p>
          )}
        </div>

        {/* Websites */}
        <div className="space-y-2">
          <Label htmlFor="metadata.websites">Websites</Label>
          <Input
            id="metadata.websites"
            {...register("metadata.websites")}
            className={hasError("websites") ? "border-red-500" : ""}
            placeholder="vendor.com, status.vendor.com"
          />
          {hasError("websites") && (
            <p className="text-sm text-red-500">{getError("websites")}</p>
          )}
        </div>

        {/* Parent Company */}
        <div className="space-y-2">
          <Label htmlFor="metadata.parent_company">Parent Company</Label>
          <Input
            id="metadata.parent_company"
            {...register("metadata.parent_company")}
            className={hasError("parent_company") ? "border-red-500" : ""}
            placeholder="e.g., Microsoft Corporation"
          />
          {hasError("parent_company") && (
            <p className="text-sm text-red-500">{getError("parent_company")}</p>
          )}
        </div>
      </div>

      {/* Metadata Notes */}
      <div className="space-y-2">
        <Label htmlFor="metadata.metadata_notes">Metadata Notes</Label>
        <Textarea
          id="metadata.metadata_notes"
          {...register("metadata.metadata_notes")}
          className={hasError("metadata_notes") ? "border-red-500" : ""}
          placeholder="Any additional metadata..."
          rows={4}
        />
        {hasError("metadata_notes") && (
          <p className="text-sm text-red-500">{getError("metadata_notes")}</p>
        )}
      </div>
    </div>
  );
};

