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
import type { IncidentNotificationFormData } from "@/lib/schemas/incidentNotification.schema";
import { DeliveryStatus } from "@/app/lib/features/incidentNotificationsApi";

const DELIVERY_STATUS_OPTIONS = [
  { value: DeliveryStatus.DRAFT, label: "Draft" },
  { value: DeliveryStatus.SENT, label: "Sent" },
  { value: DeliveryStatus.DELIVERED, label: "Delivered" },
  { value: DeliveryStatus.ACKNOWLEDGED, label: "Acknowledged" },
  { value: DeliveryStatus.FAILED, label: "Failed" },
];

export const DeliveryStatusStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentNotificationFormData>();

  const sentAt = watch("sent_at");
  const sentBy = watch("sent_by");
  const deliveryStatus = watch("delivery_status");
  const responseSummary = watch("response_summary");

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

  // Format datetime for input field
  const formatDateTimeForInput = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Delivery & Status <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sent At */}
        <div className="space-y-2">
          <Label htmlFor="sent_at">
            Sent At <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sent_at"
            type="datetime-local"
            value={formatDateTimeForInput(sentAt)}
            onChange={(e) =>
              setValue("sent_at", e.target.value, { shouldValidate: true })
            }
            className={hasError("sent_at") ? "border-red-500" : ""}
          />
          {hasError("sent_at") && (
            <p className="text-sm text-red-500">{getError("sent_at")}</p>
          )}
        </div>

        {/* Sent By */}
        <div className="space-y-2">
          <Label htmlFor="sent_by">Sent By</Label>
          <Input
            id="sent_by"
            value={sentBy || ""}
            onChange={(e) =>
              setValue("sent_by", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Name of person who sent the notification"
            className={hasError("sent_by") ? "border-red-500" : ""}
          />
          {hasError("sent_by") && (
            <p className="text-sm text-red-500">{getError("sent_by")}</p>
          )}
        </div>

        {/* Delivery Status */}
        <div className="space-y-2">
          <Label htmlFor="delivery_status">
            Delivery Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`delivery_status-${deliveryStatus || "none"}`}
            value={deliveryStatus || ""}
            onValueChange={(value) =>
              setValue("delivery_status", value as DeliveryStatus, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("delivery_status")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select delivery status" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("delivery_status") && (
            <p className="text-sm text-red-500">
              {getError("delivery_status")}
            </p>
          )}
        </div>

        {/* Response Summary */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="response_summary">Response Summary</Label>
          <Textarea
            id="response_summary"
            value={responseSummary || ""}
            onChange={(e) =>
              setValue("response_summary", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Summary of responses received"
            className={`min-h-32 resize-none ${
              hasError("response_summary") ? "border-red-500" : ""
            }`}
          />
          {hasError("response_summary") && (
            <p className="text-sm text-red-500">
              {getError("response_summary")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

