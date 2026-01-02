import { z } from "zod";
import {
  Template,
  Language,
  RegulatoryBasis,
  AudienceType,
  Channel,
  DeliveryStatus,
} from "@/app/lib/features/incidentNotificationsApi";

// Enum schemas using zod
const TemplateEnum = z.nativeEnum(Template).optional().nullable();
const LanguageEnum = z.nativeEnum(Language).optional().nullable();
const RegulatoryBasisEnum = z.nativeEnum(RegulatoryBasis).optional().nullable();
const AudienceTypeEnum = z.nativeEnum(AudienceType);
const ChannelEnum = z.nativeEnum(Channel);
const DeliveryStatusEnum = z.nativeEnum(DeliveryStatus);

export const incidentNotificationSchema = z
  .object({
    ai_incident_id: z
      .number()
      .int("Incident must be a valid integer")
      .min(1, "Incident is required"),
    template: TemplateEnum,
    language: LanguageEnum,
    regulatory_basis: RegulatoryBasisEnum,
    notification_deadline: z.string().optional().nullable().or(z.literal("")),
    audience_type: AudienceTypeEnum,
    channel: ChannelEnum,
    notice_summary: z
      .string()
      .min(1, "Notice summary is required")
      .max(5000, "Notice summary must not exceed 5000 characters"),
    notice_link: z
      .string()
      .url("Notice link must be a valid URL")
      .max(2048, "Notice link must not exceed 2048 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    sent_at: z.string().min(1, "Sent at is required"),
    sent_by: z
      .string()
      .max(255, "Sent by must not exceed 255 characters")
      .optional()
      .nullable(),
    delivery_status: DeliveryStatusEnum,
    response_summary: z
      .string()
      .max(5000, "Response summary must not exceed 5000 characters")
      .optional()
      .nullable(),
    follow_up_required: z.boolean().default(false),
    follow_up_date: z.string().optional().nullable().or(z.literal("")),
    follow_up_notes: z
      .string()
      .max(5000, "Follow up notes must not exceed 5000 characters")
      .optional()
      .nullable(),
  })
  .transform((data) => ({
    ...data,
    notification_deadline:
      data.notification_deadline === "" ? null : data.notification_deadline,
    notice_link: data.notice_link === "" ? null : data.notice_link,
    follow_up_date: data.follow_up_date === "" ? null : data.follow_up_date,
    follow_up_required: data.follow_up_required ?? false,
  }));

export type IncidentNotificationFormData = z.infer<
  typeof incidentNotificationSchema
>;

