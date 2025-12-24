import { z } from "zod";
import {
  AiCommitteeType,
  AiCommitteeCadence,
} from "@/interfaces/AiCommittee";

const TypeEnum = z.nativeEnum(AiCommitteeType);
const CadenceEnum = z.nativeEnum(AiCommitteeCadence);

export const aiCommitteeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),
  type: TypeEnum,
  charter: z.string().min(1, "Charter is required"),
  cadence: CadenceEnum,
  owner_team: z
    .string()
    .min(1, "Owner team is required")
    .max(255, "Owner team must not exceed 255 characters"),
  active: z.boolean(),
});

export type AiCommitteeFormData = z.infer<typeof aiCommitteeSchema>;

