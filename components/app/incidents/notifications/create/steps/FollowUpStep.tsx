"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { IncidentNotificationFormData } from "@/lib/schemas/incidentNotification.schema";

export const FollowUpStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentNotificationFormData>();

  const followUpRequired = watch("follow_up_required");
  const followUpDate = watch("follow_up_date");
  const followUpNotes = watch("follow_up_notes");

  const hasError = (
    fieldName: keyof IncidentNotificationFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentNotificationFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  // Format date for input field
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Follow Up
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Follow Up Required */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="follow_up_required"
              checked={followUpRequired || false}
              onCheckedChange={(checked) =>
                setValue("follow_up_required", checked === true, {
                  shouldValidate: true,
                })
              }
            />
            <Label
              htmlFor="follow_up_required"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Follow Up Required
            </Label>
          </div>
          {hasError("follow_up_required") && (
            <p className="text-sm text-red-500">
              {getError("follow_up_required")}
            </p>
          )}
        </div>

        {/* Follow Up Date */}
        {followUpRequired && (
          <div className="space-y-2">
            <Label htmlFor="follow_up_date">Follow Up Date</Label>
            <Input
              id="follow_up_date"
              type="date"
              value={formatDateForInput(followUpDate)}
              onChange={(e) =>
                setValue("follow_up_date", e.target.value || null, {
                  shouldValidate: true,
                })
              }
              className={hasError("follow_up_date") ? "border-red-500" : ""}
            />
            {hasError("follow_up_date") && (
              <p className="text-sm text-red-500">
                {getError("follow_up_date")}
              </p>
            )}
          </div>
        )}

        {/* Follow Up Notes */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="follow_up_notes">Follow Up Notes</Label>
          <Textarea
            id="follow_up_notes"
            value={followUpNotes || ""}
            onChange={(e) =>
              setValue("follow_up_notes", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Notes about follow-up actions required"
            className={`min-h-32 resize-none ${
              hasError("follow_up_notes") ? "border-red-500" : ""
            }`}
          />
          {hasError("follow_up_notes") && (
            <p className="text-sm text-red-500">
              {getError("follow_up_notes")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

