import { z } from "zod";

const StakeholderTypeEnum = z.enum([
  "person",
  "team",
  "vendor_org",
  "regulator",
  "customer_group",
  "committee_secretariat",
]);

const StakeholderStatusEnum = z.enum([
  "active",
  "in_active",
  "on_leave",
  "off_boarded",
]);

const StakeholderClassificationEnum = z.enum(["internal", "external"]);

export const stakeholderSchema = z
  .object({
    type: StakeholderTypeEnum,
    display_name: z
      .string()
      .min(1, "Display name is required")
      .max(255, "Display name must not exceed 255 characters"),
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(255, "First name must not exceed 255 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(255, "Last name must not exceed 255 characters"),
    org_unit: z
      .string()
      .min(1, "Organization unit is required")
      .max(255, "Organization unit must not exceed 255 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email must not exceed 255 characters"),
    secondary_email: z
      .string()
      .max(255, "Secondary email must not exceed 255 characters")
      .refine(
        (val) => !val || val === "" || z.string().email().safeParse(val).success,
        {
          message: "Please enter a valid email address",
        }
      )
      .optional()
      .nullable()
      .or(z.literal("")),
    phone: z
      .string()
      .min(1, "Phone is required")
      .max(20, "Phone must not exceed 20 characters"),
    mobile: z
      .string()
      .max(20, "Mobile must not exceed 20 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    role_tags: z
      .array(z.string().max(100, "Each role tag must not exceed 100 characters"))
      .min(1, "At least one role tag is required"),
    timezone: z.string().min(1, "Timezone is required"),
    classification: StakeholderClassificationEnum,
    country: z
      .string()
      .min(1, "Country is required")
      .max(500, "Country must not exceed 500 characters"),
    external_ref: z
      .string()
      .max(255, "External reference must not exceed 255 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    employee_id: z
      .string()
      .max(100, "Employee ID must not exceed 100 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    cost_center: z
      .string()
      .max(100, "Cost center must not exceed 100 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    manager: z
      .string()
      .max(255, "Manager must not exceed 255 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    delegate: z
      .string()
      .max(255, "Delegate must not exceed 255 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    status: StakeholderStatusEnum,
    notes: z.string().optional().nullable().or(z.literal("")),
    start_date: z.string().optional().nullable().or(z.literal("")),
    end_date: z.string().optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If end_date is provided, it must be after or equal to start_date
      if (data.end_date && data.start_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return end >= start;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    }
  )
  .transform((data) => ({
    ...data,
    // Transform empty strings to null for optional fields
    secondary_email: data.secondary_email === "" ? null : data.secondary_email,
    mobile: data.mobile === "" ? null : data.mobile,
    external_ref: data.external_ref === "" ? null : data.external_ref,
    employee_id: data.employee_id === "" ? null : data.employee_id,
    cost_center: data.cost_center === "" ? null : data.cost_center,
    manager: data.manager === "" ? null : data.manager,
    delegate: data.delegate === "" ? null : data.delegate,
    notes: data.notes === "" ? null : data.notes,
    start_date: data.start_date === "" ? null : data.start_date,
    end_date: data.end_date === "" ? null : data.end_date,
  }));

export type StakeholderFormData = z.infer<typeof stakeholderSchema>;

