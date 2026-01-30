"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";
import type { PrivacyIncidentFormData } from "@/lib/schemas/privacyIncident.schema";

const dataCategoryOptions = [
  { value: "name", label: "Name" },
  { value: "contact", label: "Contact" },
  { value: "identifier", label: "Identifier" },
  { value: "financial", label: "Financial" },
  { value: "health", label: "Health" },
  { value: "biometric", label: "Biometric" },
  { value: "behavioral", label: "Behavioral" },
  { value: "sensitive", label: "Sensitive" },
  { value: "children", label: "Children" },
  { value: "location", label: "Location" },
];

export const IncidentDetailsStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<PrivacyIncidentFormData>();

  const incidentDescription = watch("incident_description");
  const whatHappened = watch("what_happened");
  const howDiscovered = watch("how_discovered");
  const dataCompromised = watch("data_compromised");
  const dataCategoriesAffected = watch("data_categories_affected") || [];

  const {
    fields: subjectKeyFields,
    append: appendSubjectKey,
    remove: removeSubjectKey,
  } = useFieldArray({
    control: control as any,
    name: "affected_subject_keys",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="incident_description">
          Incident Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="incident_description"
          {...register("incident_description")}
          className={`w-full min-h-[100px] resize-none ${
            errors.incident_description ? "border-red-500" : ""
          }`}
          placeholder="Describe the incident"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.incident_description?.message}</span>
          <span>{incidentDescription?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="what_happened">
          What Happened <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="what_happened"
          {...register("what_happened")}
          className={`w-full min-h-[100px] resize-none ${
            errors.what_happened ? "border-red-500" : ""
          }`}
          placeholder="Describe what happened in detail"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.what_happened?.message}</span>
          <span>{whatHappened?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="how_discovered">
          How Discovered <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="how_discovered"
          {...register("how_discovered")}
          className={`w-full min-h-[100px] resize-none ${
            errors.how_discovered ? "border-red-500" : ""
          }`}
          placeholder="Describe how the incident was discovered"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.how_discovered?.message}</span>
          <span>{howDiscovered?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_compromised">
          Data Compromised <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="data_compromised"
          {...register("data_compromised")}
          className={`w-full min-h-[100px] resize-none ${
            errors.data_compromised ? "border-red-500" : ""
          }`}
          placeholder="Describe what data was compromised"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.data_compromised?.message}</span>
          <span>{dataCompromised?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Data Categories Affected <span className="text-red-500">*</span>
        </Label>
        <CustomMultiSelect
          options={dataCategoryOptions}
          value={dataCategoriesAffected}
          onChange={(value) => setValue("data_categories_affected", value as any)}
          placeholder="Select data categories"
          className={`w-full ${
            errors.data_categories_affected ? "border-red-500" : ""
          }`}
        />
        {errors.data_categories_affected && (
          <p className="text-sm text-red-500">
            {errors.data_categories_affected.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_affected_subjects">
          Estimated Affected Subjects <span className="text-red-500">*</span>
        </Label>
        <Input
          id="estimated_affected_subjects"
          type="number"
          min="0"
          {...register("estimated_affected_subjects", { valueAsNumber: true })}
          className={`w-full ${
            errors.estimated_affected_subjects ? "border-red-500" : ""
          }`}
          placeholder="0"
        />
        {errors.estimated_affected_subjects && (
          <p className="text-sm text-red-500">
            {errors.estimated_affected_subjects.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Affected Subject Keys (Optional)</Label>
        <div className="space-y-2">
          {subjectKeyFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`affected_subject_keys.${index}` as const)}
                className="flex-1"
                placeholder="e.g., user_123, user_456"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeSubjectKey(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSubjectKey("")}
            className="w-full"
          >
            Add Subject Key
          </Button>
        </div>
      </div>
    </div>
  );
};

