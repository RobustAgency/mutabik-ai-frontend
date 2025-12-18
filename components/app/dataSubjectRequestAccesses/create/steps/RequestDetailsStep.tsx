"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { DataSubjectRequestAccessFormData } from "@/lib/schemas/dataSubjectRequestAccess.schema";
import MultiRopaSelector from "../MultiRopaSelector";

const requestedDataCategoryOptions = [
  { value: "personal_data", label: "Personal Data" },
  { value: "contact_data", label: "Contact Data" },
  { value: "transaction_data", label: "Transaction Data" },
  { value: "behavioral_data", label: "Behavioral Data" },
  { value: "other", label: "Other" },
];

const requestSourceOptions = [
  { value: "email", label: "Email" },
  { value: "web_form", label: "Web Form" },
  { value: "phone", label: "Phone" },
  { value: "letter", label: "Letter" },
  { value: "in_person", label: "In Person" },
];

export const RequestDetailsStep: React.FC = () => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<DataSubjectRequestAccessFormData>();

  const requestDetails = watch("request_details");
  const processingActivityIds = watch("processing_activity_ids") || [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requested_data_categories",
  });
  const {
    fields: systemsFields,
    append: appendSystem,
    remove: removeSystem,
  } = useFieldArray({
    control,
    name: "systems_checked",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="request_details">
          Request Details <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="request_details"
          {...register("request_details")}
          className={`w-full min-h-[120px] resize-none ${
            errors.request_details ? "border-red-500" : ""
          }`}
          placeholder="Describe the data subject's request"
          rows={5}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.request_details?.message}</span>
          <span>{requestDetails?.length || 0} characters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requested_data_categories">
            Requested Data Categories
          </Label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(
                    `requested_data_categories.${index}` as const
                  )}
                  className="w-full"
                  placeholder="e.g., personal data, contact data"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
            >
              Add Category
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="request_source">
            Request Source <span className="text-red-500">*</span>
          </Label>
          <select
            id="request_source"
            {...register("request_source")}
            className={`w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              errors.request_source ? "border-red-500" : ""
            }`}
          >
            <option value="">Select source</option>
            {requestSourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.request_source && (
            <p className="text-sm text-red-500">
              {errors.request_source.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="submitted_date">
            Submitted Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="submitted_date"
            type="date"
            {...register("submitted_date")}
            className={`w-full ${
              errors.submitted_date ? "border-red-500" : ""
            }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="due_date"
            type="date"
            {...register("due_date")}
            className={`w-full ${errors.due_date ? "border-red-500" : ""}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="extended_due_date">Extended Due Date</Label>
          <Input
            id="extended_due_date"
            type="date"
            {...register("extended_due_date")}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Systems Checked <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          {systemsFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`systems_checked.${index}` as const)}
                className={`flex-1 ${
                  errors.systems_checked?.[index] ? "border-red-500" : ""
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
        {errors.systems_checked && (
          <p className="text-sm text-red-500">
            {errors.systems_checked.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Linked Processing Activities (ROPA)</Label>
        <MultiRopaSelector
          label=""
          value={processingActivityIds}
          onValueChange={(ids) => setValue("processing_activity_ids", ids)}
        />
      </div>
    </div>
  );
};


