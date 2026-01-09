import { z } from "zod";
import {
  MeetingType,
  AttendancePolicy,
} from "@/interfaces/CommitteeMeeting";

const MeetingTypeEnum = z.nativeEnum(MeetingType);
const AttendancePolicyEnum = z.nativeEnum(AttendancePolicy);

export const committeeMeetingSchema = z.object({
  ai_committee_id: z
    .number()
    .int("AI Committee ID must be a valid integer")
    .positive("AI Committee is required"),
  meeting_type: MeetingTypeEnum,
  scheduled_at: z
    .string()
    .min(1, "Scheduled date and time is required")
    .refine(
      (val) => {
        // Accept both datetime-local format (YYYY-MM-DDTHH:mm) and ISO format
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Scheduled date and time must be valid" }
    ),
  duration_minutes: z
    .number()
    .int("Duration must be a valid integer")
    .positive("Duration must be positive")
    .optional()
    .nullable(),
  agenda: z.string().min(1, "Agenda is required"),
  materials_link: z
    .union([
      z.string().url("Materials link must be a valid URL"),
      z.literal(""),
    ])
    .optional()
    .nullable(),
  attendance_policy: AttendancePolicyEnum,
  attendance_roster: z.array(z.string()).optional().nullable(),
  minutes_link: z
    .union([
      z.string().url("Minutes link must be a valid URL"),
      z.literal(""),
    ])
    .optional()
    .nullable(),
});

export type CommitteeMeetingFormData = z.infer<typeof committeeMeetingSchema>;

