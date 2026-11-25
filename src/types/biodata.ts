/**
 * biodata.ts — TypeScript type definitions for applicant biodata.
 * Pure types only; no runtime logic.
 */

export interface Biodata {
  /** Applicant's full legal name */
  fullName: string;
  /** Date of birth in DD/MM/YYYY format */
  dateOfBirth: string;
  /** Father's full name */
  fatherName: string;
  /**
   * One document-relevant reference value entered by the applicant
   * (e.g. roll number, CGPA/percentage, GATE score, or certificate ID).
   */
  documentReference: string;
}
