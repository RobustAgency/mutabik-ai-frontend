"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CorrectivePreventiveActionFormData } from "@/lib/schemas/correctivePreventiveAction.schema";
import {
  CapaType,
  Priority,
} from "@/app/lib/features/correctivePreventiveActionsApi";

const CAPA_TYPE_OPTIONS = [
  { value: CapaType.CORRECTIVE, label: "Corrective" },
  { value: CapaType.PREVENTIVE, label: "Preventive" },
  { value: CapaType.BOTH, label: "Both" },
];

const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: "Low" },
  { value: Priority.MEDIUM, label: "Medium" },
  { value: Priority.HIGH, label: "High" },
  { value: Priority.CRITICAL, label: "Critical" },
];

export const CAPADetailsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CorrectivePreventiveActionFormData>();

  const title = watch("title");
  const capaType = watch("capa_type");
  const priority = watch("priority");
  const rootCause = watch("root_cause");
  const actions = watch("actions");

  const hasError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          CAPA Details <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title || ""}
            onChange={(e) =>
              setValue("title", e.target.value, { shouldValidate: true })
            }
            placeholder="Enter CAPA title"
            className={hasError("title") ? "border-red-500" : ""}
          />
          {hasError("title") && (
            <p className="text-sm text-red-500">{getError("title")}</p>
          )}
        </div>

        {/* CAPA Type */}
        <div className="space-y-2">
          <Label htmlFor="capa_type">
            CAPA Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`capa_type-${capaType || "none"}`}
            value={capaType || ""}
            onValueChange={(value) =>
              setValue("capa_type", value as CapaType, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("capa_type")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select CAPA type" />
            </SelectTrigger>
            <SelectContent>
              {CAPA_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("capa_type") && (
            <p className="text-sm text-red-500">{getError("capa_type")}</p>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`priority-${priority || "none"}`}
            value={priority || ""}
            onValueChange={(value) =>
              setValue("priority", value as Priority, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("priority")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("priority") && (
            <p className="text-sm text-red-500">{getError("priority")}</p>
          )}
        </div>

        {/* Root Cause */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="root_cause">Root Cause</Label>
          <Textarea
            id="root_cause"
            value={rootCause || ""}
            onChange={(e) =>
              setValue("root_cause", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Describe the root cause"
            className={`min-h-32 resize-none ${
              hasError("root_cause") ? "border-red-500" : ""
            }`}
          />
          {hasError("root_cause") && (
            <p className="text-sm text-red-500">{getError("root_cause")}</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="actions">
            Actions <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="actions"
            value={actions || ""}
            onChange={(e) =>
              setValue("actions", e.target.value, { shouldValidate: true })
            }
            placeholder="Describe the actions to be taken"
            className={`min-h-32 resize-none ${
              hasError("actions") ? "border-red-500" : ""
            }`}
          />
          {hasError("actions") && (
            <p className="text-sm text-red-500">{getError("actions")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

