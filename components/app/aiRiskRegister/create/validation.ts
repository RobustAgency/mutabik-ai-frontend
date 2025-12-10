import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";
import { FormState } from "./types";

export const validateStep = (
  step: number,
  formState: FormState
): { isValid: boolean; errors: Record<string, string[]> } => {
  const fieldErrors: Record<string, string[]> = {};

  if (step === 1) {
    // Basic Information
    fieldErrors.title = validateTextField(formState.title, {
      required: true,
      messages: { required: "Title is required" },
    });
    fieldErrors.description = validateTextField(formState.description, {
      required: true,
      messages: { required: "Description is required" },
    });
    fieldErrors.risk_category = validateTextField(formState.risk_category, {
      required: true,
    });
    fieldErrors.status = validateTextField(formState.status, { required: true });
    fieldErrors.ai_model_id = validateTextField(formState.ai_model_id, {
      required: true,
      messages: { required: "AI Model is required" },
    });
  }

  if (step === 2) {
    // Risk Assessment
    const riskMethodologyNum = formState.risk_methodology_id
      ? Number(formState.risk_methodology_id)
      : undefined;
    fieldErrors.risk_methodology_id = validateNumericField(riskMethodologyNum, {
      required: true,
      integer: true,
      messages: { required: "Risk Methodology is required" },
    });
    fieldErrors.likelihood_code = validateTextField(formState.likelihood_code, {
      required: true,
      messages: { required: "Likelihood code is required" },
    });
    fieldErrors.impact_code = validateTextField(formState.impact_code, {
      required: true,
      messages: { required: "Impact code is required" },
    });
    fieldErrors.risk_level = validateTextField(formState.risk_level, {
      required: true,
    });
    fieldErrors.decision = validateTextField(formState.decision, {
      required: true,
    });
  }

  if (step === 3) {
    // Ownership & Review
    const riskOwnerNum = formState.risk_owner
      ? Number(formState.risk_owner)
      : undefined;
    fieldErrors.risk_owner = validateNumericField(riskOwnerNum, {
      required: true,
      integer: true,
      messages: { required: "Risk owner is required" },
    });
    fieldErrors.review_cadence = validateTextField(formState.review_cadence, {
      required: true,
    });
    fieldErrors.next_review_due = validateTextField(formState.next_review_due, {
      required: true,
      messages: { required: "Next review date is required" },
    });
    fieldErrors.created_by = validateTextField(formState.created_by, {
      required: true,
      messages: { required: "Created by (email) is required" },
    });
  }

  // Step 4 (Links & Evidence) - all fields are optional, no validation needed

  const errors = createValidationErrors(fieldErrors);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const parseNumber = (value: string) => {
  if (!value || value.trim() === "" || value === "0") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed;
};

