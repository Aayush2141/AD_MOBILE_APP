/**
 * compareFields.ts — Pure field normalization, fuzzy matching, and
 * biodata-vs-document comparison logic.
 */

import { Biodata } from '../types/biodata';
import {
  DocumentType,
  ExtractedField,
  VerificationResult,
  VerificationStatus,
} from '../types/document';

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

/**
 * Normalizes general text for comparison:
 * trim, lowercase, strip punctuation, and collapse multiple spaces.
 */
export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes numeric/alphanumeric reference values (e.g. roll number, CGPA, score).
 * Preserves decimal points so "7.80" vs "7.8" can be compared cleanly.
 */
export function normalizeReference(value: string): string {
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, '');
  const numeric = Number(cleaned);
  if (!Number.isNaN(numeric) && cleaned !== '') {
    return String(numeric);
  }
  return cleaned.replace(/[^a-z0-9.]/g, '');
}

/**
 * Normalizes common date formats (DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD)
 * into a single canonical YYYY-MM-DD string. Returns normalized text if unrecognized.
 */
export function normalizeDate(value: string): string {
  const trimmed = value.trim();

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmy = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/.exec(trimmed);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }

  // YYYY-MM-DD or YYYY/MM/DD
  const ymd = /^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/.exec(trimmed);
  if (ymd) {
    const year = ymd[1];
    const month = ymd[2].padStart(2, '0');
    const day = ymd[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return normalizeText(trimmed);
}

// ---------------------------------------------------------------------------
// Lightweight fuzzy string matching (Levenshtein distance)
// ---------------------------------------------------------------------------

/** Computes Levenshtein edit distance between two strings. */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,      // deletion
        curr[j - 1] + 1,  // insertion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

/**
 * Compares two names after normalization, allowing a small edit distance
 * (up to 1 edit for short names, or 2 edits for names >= 10 chars).
 */
export function fuzzyNameMatch(a: string, b: string): boolean {
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (!normA || !normB) return false;
  if (normA === normB) return true;

  const maxLen = Math.max(normA.length, normB.length);
  const allowedEdits = maxLen >= 10 ? 2 : 1;
  return levenshteinDistance(normA, normB) <= allowedEdits;
}

// ---------------------------------------------------------------------------
// Main comparison function
// ---------------------------------------------------------------------------

const REFERENCE_FIELD_KEYS = new Set([
  'roll_number',
  'cgpa',
  'percentage',
  'gate_score',
  'certificate_number',
]);

/**
 * Compares extracted document fields against applicant biodata and returns
 * a complete VerificationResult with per-field match/mismatch status.
 */
export function compareFields(
  biodata: Biodata,
  extractedFields: ExtractedField[],
  documentType: DocumentType,
  processingTimeMs = 0,
): VerificationResult {
  const evaluatedFields: ExtractedField[] = extractedFields.map((field) => {
    let matchesBiodata = field.matchesBiodata;

    switch (field.key) {
      case 'candidate_name':
      case 'name':
        matchesBiodata = fuzzyNameMatch(field.value, biodata.fullName);
        break;
      case 'father_name':
        matchesBiodata = fuzzyNameMatch(field.value, biodata.fatherName);
        break;
      case 'date_of_birth':
      case 'dob':
        matchesBiodata =
          normalizeDate(field.value) === normalizeDate(biodata.dateOfBirth);
        break;
      default:
        if (REFERENCE_FIELD_KEYS.has(field.key)) {
          matchesBiodata =
            normalizeReference(field.value) ===
            normalizeReference(biodata.documentReference);
        }
        break;
    }

    return {
      ...field,
      matchesBiodata,
    };
  });

  const mismatches = evaluatedFields.filter((f) => !f.matchesBiodata);

  const status: VerificationStatus =
    mismatches.length === 0
      ? 'verified'
      : mismatches.length === evaluatedFields.length
      ? 'failed'
      : 'mismatch';

  return {
    id: `ver-${Date.now()}`,
    documentType,
    status,
    extractedFields: evaluatedFields,
    mismatches,
    verifiedAt: new Date().toISOString(),
    processingTimeMs,
  };
}
