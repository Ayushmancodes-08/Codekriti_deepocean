/**
 * Centralized validation error messages
 * Used across all form components for consistency
 */

export const validationMessages = {
  // Required fields
  required: 'This field is required',
  
  // Name validation
  nameRequired: 'Name is required',
  nameMinLength: 'Name must be at least 2 characters',
  
  // Email validation
  emailRequired: 'Email is required',
  invalidEmail: 'Please enter a valid email address',
  
  // Phone validation
  phoneRequired: 'Phone number is required',
  invalidPhone: 'Phone number must be 10 digits',
  
  // Student ID validation
  studentIdRequired: 'Student ID is required',
  
  // College validation
  collegeRequired: 'College is required',
  
  // Branch validation
  branchRequired: 'Branch is required',
  
  // Year validation
  yearRequired: 'Year is required',
  
  // Team validation
  teamNameRequired: 'Team name is required',
  teamNameMinLength: 'Team name must be at least 2 characters',
  teamSizeInvalid: 'Team size must be between {min} and {max} members',
  
  // Event validation
  eventRequired: 'Please select an event',
  
  // Generic validation
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must not exceed {max} characters',
} as const;

/**
 * Format validation message with parameters
 * @param message - The message template
 * @param params - Parameters to replace in the template
 * @returns Formatted message
 */
export function formatValidationMessage(
  message: string,
  params?: Record<string, string | number>
): string {
  if (!params) return message;
  
  let formatted = message;
  Object.entries(params).forEach(([key, value]) => {
    formatted = formatted.replace(`{${key}}`, String(value));
  });
  return formatted;
}

/**
 * Get error message from Zod error
 * @param error - Zod validation error
 * @returns Formatted error message
 */
export function getZodErrorMessage(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return validationMessages.required;
}

/**
 * Extract field errors from Zod validation result
 * @param errors - Zod validation errors
 * @returns Object mapping field names to error messages
 */
export function extractFieldErrors(errors: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  if (errors?.fieldErrors) {
    Object.entries(errors.fieldErrors).forEach(([field, messages]: [string, any]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0];
      }
    });
  }
  
  return fieldErrors;
}
