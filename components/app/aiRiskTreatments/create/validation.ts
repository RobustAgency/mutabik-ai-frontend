"use client";

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
    fieldErrors.ai_risk_register_id = validateNumericField(
      formState.ai_risk_register_id ? Number(formState.ai_risk_register_id) : undefined,
      {
        required: true,
        integer: true,
        messages: { required: "AI Risk Register is required" },
      }
    );
    fieldErrors.plan_summary = validateTextField(formState.plan_summary, {
      required: true,
      messages: { required: "Plan summary is required" },
    });
    fieldErrors.owner_stakeholder_id = validateNumericField(
      formState.owner_stakeholder_id ? Number(formState.owner_stakeholder_id) : undefined,
      {
        required: true,
        integer: true,
        messages: { required: "Owner stakeholder is required" },
      }
    );
    fieldErrors.due_date = validateTextField(formState.due_date, {
      required: true,
      messages: { required: "Due date is required" },
    });
  }

  if (step === 2) {
    fieldErrors.status = validateTextField(formState.status, {
      required: true,
      messages: { required: "Status is required" },
    });
  }

  const errors = createValidationErrors(fieldErrors);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


