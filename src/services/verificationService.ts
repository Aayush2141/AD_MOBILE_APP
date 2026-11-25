/**
 * verificationService.ts — MOCK document verification service.
 *
 * ⚠️  ALL EXTRACTED FIELDS RETURNED HERE ARE HARDCODED PLACEHOLDER DATA.
 *     This function simulates network + ML latency with a setTimeout, then
 *     runs real biodata comparison via compareFields().
 *     Replace the extraction step with a real IDP API call in Commit 10+.
 */

import { Biodata } from '../types/biodata';
import { DocumentType, ExtractedField, VerificationResult } from '../types/document';
import { compareFields } from '../utils/compareFields';

// ---------------------------------------------------------------------------
// Mock field banks per document type
// ---------------------------------------------------------------------------

/** Returns a set of hardcoded ExtractedField objects for the given type. */
function getMockFields(type: DocumentType): ExtractedField[] {
  switch (type) {
    case 'marksheet':
      return [
        { key: 'candidate_name', value: 'Rahul Sharma',              confidence: 0.97, matchesBiodata: true },
        { key: 'father_name',    value: 'Suresh Sharma',             confidence: 0.95, matchesBiodata: true },
        { key: 'date_of_birth',  value: '2000-08-15',                confidence: 0.96, matchesBiodata: true },
        { key: 'cgpa',           value: '7.8',                       confidence: 0.92, matchesBiodata: true },
        { key: 'university',     value: 'Delhi Technological Univ.', confidence: 0.98, matchesBiodata: true },
      ];
    case 'gate':
      return [
        { key: 'candidate_name', value: 'Rahul Sharma',        confidence: 0.96, matchesBiodata: true },
        { key: 'father_name',    value: 'Suresh Sharma',       confidence: 0.94, matchesBiodata: true },
        { key: 'gate_score',     value: '712',                 confidence: 0.99, matchesBiodata: true },
        { key: 'discipline',     value: 'Electronics & Comm.', confidence: 0.97, matchesBiodata: true },
      ];
    default:
      return [
        { key: 'candidate_name', value: 'Rahul Sharma',     confidence: 0.97, matchesBiodata: true },
        { key: 'father_name',    value: 'Suresh Sharma',    confidence: 0.93, matchesBiodata: true },
        { key: 'date_of_birth',  value: '15/08/2000',       confidence: 0.91, matchesBiodata: true },
        { key: 'certificate_number', value: 'CERT-2023-01', confidence: 0.89, matchesBiodata: true },
      ];
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * verifyDocument — simulates the IDP extraction + biodata comparison pipeline.
 *
 * @param documentType  The category of document being verified.
 * @param fileUri       URI of the picked file (unused in mock; will be sent to API).
 * @param biodata       Applicant biodata entered on BiodataScreen.
 * @returns             A resolved VerificationResult after ~1 s simulated delay.
 */
export async function verifyDocument(
  documentType: DocumentType,
  fileUri: string,
  biodata: Biodata,
): Promise<VerificationResult> {
  const startTime = Date.now();

  // Simulate network + ML processing delay (target is <3 s in production)
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));

  const extractedFields = getMockFields(documentType);
  return compareFields(
    biodata,
    extractedFields,
    documentType,
    Date.now() - startTime,
  );
}
