/**
 * document.ts — TypeScript type definitions for document verification.
 * No runtime logic lives here; pure types only.
 */

// ---------------------------------------------------------------------------
// Document categories accepted by DRDO RAC
// ---------------------------------------------------------------------------

/** Union of all supported document categories */
export type DocumentType =
  | 'marksheet'    // Degree / semester marksheet
  | 'certificate'  // Educational degree or passing certificate
  | 'gate'         // GATE scorecard
  | 'experience'   // Work / experience certificate
  | 'caste'        // Caste / community certificate (SC / ST / OBC)
  | 'ews'          // Economically Weaker Section certificate
  | 'pwd';         // Person with Disability certificate

// ---------------------------------------------------------------------------
// Extracted field (single key-value pair pulled from a document)
// ---------------------------------------------------------------------------

export interface ExtractedField {
  /** Machine-readable field name, e.g. "candidate_name", "roll_number" */
  key: string;
  /** Raw value as extracted from the document */
  value: string;
  /** Confidence score from the IDP model (0–1) */
  confidence: number;
  /** True when the extracted value matches the applicant's self-reported biodata */
  matchesBiodata: boolean;
}

// ---------------------------------------------------------------------------
// Verification result for a single document
// ---------------------------------------------------------------------------

export type VerificationStatus = 'pending' | 'verified' | 'mismatch' | 'failed';

export interface VerificationResult {
  /** Unique ID for this verification run */
  id: string;
  /** Category of the document that was verified */
  documentType: DocumentType;
  /** Overall verification status */
  status: VerificationStatus;
  /** All fields extracted by the IDP pipeline */
  extractedFields: ExtractedField[];
  /** Fields where the extracted value does NOT match biodata */
  mismatches: ExtractedField[];
  /** ISO-8601 timestamp when the verification was completed */
  verifiedAt: string;
  /** Processing time in milliseconds (target: < 3000 ms) */
  processingTimeMs: number;
}
