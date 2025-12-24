import { z } from "zod";
import {
  CommitteeMembershipMemberRole,
  CommitteeMembershipEligibility,
} from "@/interfaces/CommitteeMembership";

const MemberRoleEnum = z.nativeEnum(CommitteeMembershipMemberRole);
const EligibilityEnum = z.nativeEnum(CommitteeMembershipEligibility);

export const committeeMembershipSchema = z.object({
  ai_committee_id: z
    .number("Committee is required")
    .int("Committee must be a valid integer")
    .positive("Committee is required"),
  stakeholder_id: z
    .number("Stakeholder is required")
    .int("Stakeholder must be a valid integer")
    .positive("Stakeholder is required"),
  member_role: MemberRoleEnum,
  eligibility: EligibilityEnum,
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  expertise_tags: z
    .array(z.string().max(50, "Each expertise tag must not exceed 50 characters"))
    .optional()
    .nullable()
    .default([]),
}).refine(
  (data) => {
    if (data.end_date) {
      return new Date(data.end_date) >= new Date(data.start_date);
    }
    return true;
  },
  {
    message: "End date must be after or equal to start date",
    path: ["end_date"],
  }
);

export type CommitteeMembershipFormData = z.infer<typeof committeeMembershipSchema>;

