import { z } from "zod";
import { GovernancePillar } from "@/utils/governancePillar";

export const projectSchema = z.object({
  ai_model_id: z.coerce
    .number("AI model is required")
    .int("AI model is required")
    .positive("AI model is required"),
  name: z
    .string()
    .min(1, "Project name is required")
    .max(255, "Project name must be at most 255 characters")
    .transform((value) => value.trim()),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .transform((value) => (value ?? "").trim()),
  governance_pillar: z.nativeEnum(GovernancePillar, {
    message: "Governance pillar is required",
  }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;


