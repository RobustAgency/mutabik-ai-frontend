"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PrivacyIncidentFormData } from "@/lib/schemas/privacyIncident.schema";

const notificationRequiredOptions = [
  { value: "none", label: "None" },
  { value: "authority", label: "Authority Only" },
  { value: "subjects", label: "Subjects Only" },
  { value: "both", label: "Both" },
];

const notificationStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "not_required", label: "Not Required" },
  { value: "in_progress", label: "In Progress" },
  { value: "authority_notified", label: "Authority Notified" },
  { value: "subjects_notified", label: "Subjects Notified" },
  { value: "completed", label: "Completed" },
];

const notificationMethodOptions = [
  { value: "email", label: "Email" },
  { value: "letter", label: "Letter" },
  { value: "phone", label: "Phone" },
  { value: "SMS", label: "SMS" },
  { value: "website", label: "Website" },
  { value: "media_announcement", label: "Media Announcement" },
];

export const NotificationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PrivacyIncidentFormData>();

  const authorityNotified = watch("authority_notified");
  const subjectsNotified = watch("subjects_notified");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="notification_required">
            Notification Required <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("notification_required")}
            onValueChange={(value) => setValue("notification_required", value as any)}
          >
            <SelectTrigger
              className={`w-full ${
                errors.notification_required ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select notification requirement" />
            </SelectTrigger>
            <SelectContent>
              {notificationRequiredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.notification_required && (
            <p className="text-sm text-red-500">
              {errors.notification_required.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification_status">
            Notification Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("notification_status")}
            onValueChange={(value) => setValue("notification_status", value as any)}
          >
            <SelectTrigger
              className={`w-full ${
                errors.notification_status ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select notification status" />
            </SelectTrigger>
            <SelectContent>
              {notificationStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.notification_status && (
            <p className="text-sm text-red-500">
              {errors.notification_status.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-sm text-[#475467]">Authority Notification</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="authority_notified"
              checked={authorityNotified}
              onCheckedChange={(checked) => {
                setValue("authority_notified", checked === true);
                if (!checked) {
                  setValue("authority_notification_date", null);
                  setValue("supervisory_authority", null);
                }
              }}
            />
            <Label
              htmlFor="authority_notified"
              className="cursor-pointer font-normal"
              onClick={() => setValue("authority_notified", !authorityNotified)}
            >
              Authority has been notified
            </Label>
          </div>
        </div>

        {authorityNotified && (
          <div className="space-y-4 pl-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authority_notification_date">
                  Authority Notification Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="authority_notification_date"
                  type="date"
                  {...register("authority_notification_date")}
                  className={`w-full ${
                    errors.authority_notification_date ? "border-red-500" : ""
                  }`}
                />
                {errors.authority_notification_date && (
                  <p className="text-sm text-red-500">
                    {errors.authority_notification_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisory_authority">
                  Supervisory Authority <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="supervisory_authority"
                  {...register("supervisory_authority")}
                  className={`w-full ${
                    errors.supervisory_authority ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., ICO, CNIL"
                  maxLength={255}
                />
                {errors.supervisory_authority && (
                  <p className="text-sm text-red-500">
                    {errors.supervisory_authority.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authority_reference_number">
                  Authority Reference Number
                </Label>
                <Input
                  id="authority_reference_number"
                  {...register("authority_reference_number")}
                  className="w-full"
                  placeholder="Reference number from authority"
                  maxLength={255}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="authority_response">Authority Response</Label>
              <Textarea
                id="authority_response"
                {...register("authority_response")}
                className="w-full min-h-[100px] resize-none"
                placeholder="Response or feedback from authority"
                rows={4}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-sm text-[#475467]">Subject Notification</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="subjects_notified"
              checked={subjectsNotified}
              onCheckedChange={(checked) => {
                setValue("subjects_notified", checked === true);
                if (!checked) {
                  setValue("subject_notification_date", null);
                  setValue("notification_method", null);
                }
              }}
            />
            <Label
              htmlFor="subjects_notified"
              className="cursor-pointer font-normal"
              onClick={() => setValue("subjects_notified", !subjectsNotified)}
            >
              Subjects have been notified
            </Label>
          </div>
        </div>

        {subjectsNotified && (
          <div className="space-y-4 pl-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject_notification_date">
                  Subject Notification Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject_notification_date"
                  type="date"
                  {...register("subject_notification_date")}
                  className={`w-full ${
                    errors.subject_notification_date ? "border-red-500" : ""
                  }`}
                />
                {errors.subject_notification_date && (
                  <p className="text-sm text-red-500">
                    {errors.subject_notification_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_method">
                  Notification Method <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("notification_method") || ""}
                  onValueChange={(value) =>
                    setValue("notification_method", value === "" ? null : (value as any))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.notification_method ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationMethodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.notification_method && (
                  <p className="text-sm text-red-500">
                    {errors.notification_method.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification_template_used">
                Notification Template Used
              </Label>
              <Input
                id="notification_template_used"
                {...register("notification_template_used")}
                className="w-full"
                placeholder="Template identifier or name"
                maxLength={255}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

