import { z } from "zod";
import { Role } from "@/interfaces/Roles";

/* -------------------- Helpers -------------------- */

const roleValues = Object.values(Role) as [Role, ...Role[]];

/* -------------------- Member Schema -------------------- */

export const memberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  role: z.enum(roleValues, {
    message: "Role is required",
  }),
});

/* -------------------- Invite Users Schema -------------------- */

export const inviteUsersSchema = z
  .object({
    members: z
      .array(memberSchema)
      .min(1, "At least one team member is required"),
  })
  .superRefine((data, ctx) => {
    const emails = data.members.map((m) => m.email.toLowerCase());
    const duplicates = emails.filter(
      (email, idx) => emails.indexOf(email) !== idx
    );

    if (duplicates.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["members"],
        message: `Duplicate emails: ${[...new Set(duplicates)].join(", ")}`,
      });
    }
  });

export type InviteUsersForm = z.infer<typeof inviteUsersSchema>;
