import { z } from "zod";

// Website URL validation regex matching Laravel validation
const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;

export const organizationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must not exceed 255 characters"),
    website: z
      .string()
      .max(255, "Website must not exceed 255 characters")
      .regex(websiteRegex, "Website must be a valid URL")
      .optional()
      .nullable()
      .or(z.literal("")),
    phone: z
      .string()
      .max(20, "Phone must not exceed 20 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    country: z
      .string()
      .max(500, "Country must not exceed 500 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    is_active: z.boolean(),
  })
  .transform((data) => ({
    ...data,
    website: data.website === "" ? null : data.website,
    phone: data.phone === "" ? null : data.phone,
    country: data.country === "" ? null : data.country,
  }));

export type OrganizationFormData = z.infer<typeof organizationSchema>;

