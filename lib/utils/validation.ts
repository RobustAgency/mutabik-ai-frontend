/**
 * Form Validation Utilities
 * 
 * Centralized validation functions to reduce repetition across form components.
 * All validation functions return an array of error messages (empty if valid).
 */

/**
 * Validation rules for text fields
 */
export interface TextFieldRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  messages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    length?: string; // Combined min/max message
    pattern?: string;
  };
}

/**
 * Validation rules for numeric fields
 */
export interface NumericFieldRules {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  messages?: {
    required?: string;
    min?: string;
    max?: string;
    range?: string; // Combined min/max message
    integer?: string;
    positive?: string;
  };
}

/**
 * Validation rules for array fields
 */
export interface ArrayFieldRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  messages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
  };
}

/**
 * Validate email address
 * @param email - Email address to validate
 * @param customMessage - Optional custom error message
 * @returns Array of error messages (empty if valid)
 */
export const validateEmail = (
  email: string | null | undefined,
  customMessage?: string
): string[] => {
  const errors: string[] = [];
  const trimmed = email?.trim() || "";
  
  if (!trimmed) {
    return errors; // Empty is valid unless required field validation is used
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    errors.push(customMessage || "Please enter a valid email address");
  }
  
  return errors;
};

/**
 * Validate text field with configurable rules
 * @param value - Text value to validate
 * @param rules - Validation rules
 * @returns Array of error messages (empty if valid)
 */
export const validateTextField = (
  value: string | null | undefined,
  rules: TextFieldRules
): string[] => {
  const errors: string[] = [];
  const trimmed = value?.trim() || "";

  // Required validation
  if (rules.required && !trimmed) {
    errors.push(rules.messages?.required || "This field is required");
    return errors; // Return early if required field is empty
  }

  // Skip other validations if field is empty and not required
  if (!trimmed) {
    return errors;
  }

  // Length validation
  if (rules.minLength !== undefined || rules.maxLength !== undefined) {
    const min = rules.minLength || 0;
    const max = rules.maxLength || Infinity;
    
    if (trimmed.length < min || trimmed.length > max) {
      if (rules.messages?.length) {
        errors.push(rules.messages.length);
      } else if (rules.messages?.minLength && trimmed.length < min) {
        errors.push(rules.messages.minLength);
      } else if (rules.messages?.maxLength && trimmed.length > max) {
        errors.push(rules.messages.maxLength);
      } else if (min > 0 && max < Infinity) {
        errors.push(`This field must be between ${min}-${max} characters`);
      } else if (min > 0) {
        errors.push(`This field must be at least ${min} characters`);
      } else if (max < Infinity) {
        errors.push(`This field must be at most ${max} characters`);
      }
    }
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmed)) {
    errors.push(rules.messages?.pattern || "Invalid format");
  }

  return errors;
};

/**
 * Validate numeric field with configurable rules
 * @param value - Numeric value to validate
 * @param rules - Validation rules
 * @returns Array of error messages (empty if valid)
 */
export const validateNumericField = (
  value: number | null | undefined,
  rules: NumericFieldRules
): string[] => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (value === null || value === undefined)) {
    errors.push(rules.messages?.required || "This field is required");
    return errors;
  }

  // Skip other validations if field is empty and not required
  if (value === null || value === undefined) {
    return errors;
  }

  // Integer validation
  if (rules.integer && !Number.isInteger(value)) {
    errors.push(rules.messages?.integer || "This field must be a whole number");
  }

  // Positive validation
  if (rules.positive && value < 0) {
    errors.push(rules.messages?.positive || "This field must be positive");
  }

  // Range validation
  if (rules.min !== undefined || rules.max !== undefined) {
    const min = rules.min ?? -Infinity;
    const max = rules.max ?? Infinity;
    
    if (value < min || value > max) {
      if (rules.messages?.range) {
        errors.push(rules.messages.range);
      } else if (rules.messages?.min && value < min) {
        errors.push(rules.messages.min);
      } else if (rules.messages?.max && value > max) {
        errors.push(rules.messages.max);
      } else if (min > -Infinity && max < Infinity) {
        errors.push(`This field must be between ${min}-${max}`);
      } else if (min > -Infinity) {
        errors.push(`This field must be at least ${min}`);
      } else if (max < Infinity) {
        errors.push(`This field must be at most ${max}`);
      }
    }
  }

  return errors;
};

/**
 * Validate array field with configurable rules
 * @param value - Array value to validate
 * @param rules - Validation rules
 * @returns Array of error messages (empty if valid)
 */
export const validateArrayField = (
  value: any[] | null | undefined,
  rules: ArrayFieldRules
): string[] => {
  const errors: string[] = [];
  const array = value || [];

  // Required validation (at least one item)
  if (rules.required && array.length === 0) {
    errors.push(rules.messages?.required || "At least one item is required");
    return errors;
  }

  // Min length validation
  if (rules.minLength !== undefined && array.length < rules.minLength) {
    errors.push(
      rules.messages?.minLength ||
      `At least ${rules.minLength} item${rules.minLength > 1 ? 's' : ''} required`
    );
  }

  // Max length validation
  if (rules.maxLength !== undefined && array.length > rules.maxLength) {
    errors.push(
      rules.messages?.maxLength ||
      `At most ${rules.maxLength} item${rules.maxLength > 1 ? 's' : ''} allowed`
    );
  }

  return errors;
};

/**
 * Validate URL
 * @param url - URL to validate
 * @param customMessage - Optional custom error message
 * @returns Array of error messages (empty if valid)
 */
export const validateUrl = (
  url: string | null | undefined,
  customMessage?: string
): string[] => {
  const errors: string[] = [];
  const trimmed = url?.trim() || "";
  
  if (!trimmed) {
    return errors; // Empty is valid unless required field validation is used
  }
  
  try {
    new URL(trimmed);
  } catch {
    errors.push(customMessage || "Please enter a valid URL");
  }
  
  return errors;
};

/**
 * Validate phone number (basic validation)
 * @param phone - Phone number to validate
 * @param customMessage - Optional custom error message
 * @returns Array of error messages (empty if valid)
 */
export const validatePhone = (
  phone: string | null | undefined,
  customMessage?: string
): string[] => {
  const errors: string[] = [];
  const trimmed = phone?.trim() || "";
  
  if (!trimmed) {
    return errors; // Empty is valid unless required field validation is used
  }
  
  // Basic phone validation: at least 10 digits
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
  if (!phoneRegex.test(trimmed)) {
    errors.push(customMessage || "Please enter a valid phone number");
  }
  
  return errors;
};

/**
 * Validate date (checks if date is valid and optionally within range)
 * @param date - Date string to validate
 * @param rules - Optional date range rules
 * @returns Array of error messages (empty if valid)
 */
export const validateDate = (
  date: string | null | undefined,
  rules?: {
    min?: string; // ISO date string
    max?: string; // ISO date string
    messages?: {
      invalid?: string;
      min?: string;
      max?: string;
    };
  }
): string[] => {
  const errors: string[] = [];
  
  if (!date) {
    return errors; // Empty is valid unless required field validation is used
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push(rules?.messages?.invalid || "Invalid date");
    return errors;
  }
  
  if (rules?.min) {
    const minDate = new Date(rules.min);
    if (dateObj < minDate) {
      errors.push(rules.messages?.min || `Date must be on or after ${rules.min}`);
    }
  }
  
  if (rules?.max) {
    const maxDate = new Date(rules.max);
    if (dateObj > maxDate) {
      errors.push(rules.messages?.max || `Date must be on or before ${rules.max}`);
    }
  }
  
  return errors;
};

/**
 * Validate date range (checks if end date is after or equal to start date)
 * @param startDate - Start date string
 * @param endDate - End date string
 * @param rules - Optional validation rules
 * @returns Array of error messages (empty if valid)
 */
export const validateDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  rules?: {
    messages?: {
      invalidRange?: string;
      invalidStart?: string;
      invalidEnd?: string;
    };
  }
): string[] => {
  const errors: string[] = [];
  
  // If both dates are empty, it's valid (optional fields)
  if (!startDate && !endDate) {
    return errors;
  }
  
  // Validate start date if provided
  if (startDate) {
    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj.getTime())) {
      errors.push(rules?.messages?.invalidStart || "Invalid start date");
      return errors;
    }
  }
  
  // Validate end date if provided
  if (endDate) {
    const endDateObj = new Date(endDate);
    if (isNaN(endDateObj.getTime())) {
      errors.push(rules?.messages?.invalidEnd || "Invalid end date");
      return errors;
    }
    
    // If both dates are provided, check range
    if (startDate) {
      const startDateObj = new Date(startDate);
      if (endDateObj < startDateObj) {
        errors.push(rules?.messages?.invalidRange || "End date must be after or equal to start date");
      }
    }
  }
  
  return errors;
};

/**
 * Combine multiple validation results
 * @param validations - Array of validation results
 * @returns Combined array of error messages
 */
export const combineValidations = (...validations: string[][]): string[] => {
  return validations.flat();
};

/**
 * Check if validation result has errors
 * @param errors - Validation errors array
 * @returns True if there are errors
 */
export const hasErrors = (errors: string[]): boolean => {
  return errors.length > 0;
};

/**
 * Create a validation errors object for form state
 * @param fieldErrors - Object mapping field names to error arrays
 * @returns Filtered object with only fields that have errors
 */
export const createValidationErrors = (
  fieldErrors: Record<string, string[]>
): Record<string, string[]> => {
  return Object.entries(fieldErrors).reduce((acc, [field, errors]) => {
    if (errors.length > 0) {
      acc[field] = errors;
    }
    return acc;
  }, {} as Record<string, string[]>);
};

