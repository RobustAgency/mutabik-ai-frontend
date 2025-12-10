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
    const aiRiskRegisterNum = formState.ai_risk_register_id
      ? Number(formState.ai_risk_register_id)
      : undefined;
    fieldErrors.ai_risk_register_id = validateNumericField(aiRiskRegisterNum, {
      required: true,
      integer: true,
      messages: { required: "AI Risk Register is required" },
    });
    fieldErrors.name = validateTextField(formState.name, {
      required: true,
      messages: { required: "Name is required" },
    });
    fieldErrors.definition = validateTextField(formState.definition, {
      required: true,
      messages: { required: "Definition is required" },
    });
    fieldErrors.sample_window = validateTextField(formState.sample_window, {
      required: true,
      messages: { required: "Sample window is required" },
    });
    fieldErrors.owner_team = validateTextField(formState.owner_team, {
      required: true,
      messages: { required: "Owner team is required" },
    });
  }

  if (step === 2) {
    fieldErrors.threshold_warning = validateNumericField(
      Number(formState.threshold_warning),
      {
        required: true,
        messages: { required: "Warning threshold is required" },
      }
    );
    fieldErrors.threshold_critical = validateNumericField(
      Number(formState.threshold_critical),
      {
        required: true,
        messages: { required: "Critical threshold is required" },
      }
    );
    fieldErrors.data_source = validateTextField(formState.data_source, {
      required: true,
      messages: { required: "Data source is required" },
    });
  }

  const errors = createValidationErrors(fieldErrors);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

