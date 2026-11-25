/**
 * validation.ts — Pure form validation helpers for applicant biodata.
 */

import { Biodata } from '../types/biodata';

export type BiodataErrors = Partial<Record<keyof Biodata, string>>;

/** Returns true if value is non-empty after trimming whitespace. */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates a date string strictly in DD/MM/YYYY format
 * and verifies that day/month/year form a real calendar date.
 */
export function isValidDob(dob: string): boolean {
  const trimmed = dob.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || year < 1900 || year > 2100) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validates all fields of the Biodata form.
 * Returns an object mapping invalid field keys to error messages.
 */
export function validateBiodata(data: Biodata): BiodataErrors {
  const errors: BiodataErrors = {};

  if (!isRequired(data.fullName)) {
    errors.fullName = 'Full name is required.';
  }

  if (!isRequired(data.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required.';
  } else if (!isValidDob(data.dateOfBirth)) {
    errors.dateOfBirth = 'Enter a valid date in DD/MM/YYYY format.';
  }

  if (!isRequired(data.fatherName)) {
    errors.fatherName = "Father's name is required.";
  }

  if (!isRequired(data.documentReference)) {
    errors.documentReference = 'Please enter a roll number, CGPA, or score.';
  }

  return errors;
}
