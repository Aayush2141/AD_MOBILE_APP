/**
 * verificationService.ts — Document verification orchestrator.
 *
 * Uses `USE_MOCK` from `src/constants/config.ts`:
 *  - true  (default): returns hardcoded placeholder extractions after ~1 s.
 *  - false: uploads the file to the IDP backend via `apiClient.ts`.
 *
 * In both modes, extracted fields are compared against the applicant's biodata
 * using `compareFields()`.
 */

import { USE_MOCK } from '../constants/config';
import { Biodata } from '../types/biodata';
import { DocumentType, ExtractedField, VerificationResult } from '../types/document';
import { compareFields } from '../utils/compareFields';
import { extractDocumentFields } from './apiClient';
import { PickedFile } from './filePicker';

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
        { key: 'candidate_name',     value: 'Rahul Sharma', confidence: 0.97, matchesBiodata: true },
        { key: 'father_name',        value: 'Suresh Sharma', confidence: 0.93, matchesBiodata: true },
        { key: 'date_of_birth',      value: '15/08/2000',    confidence: 0.91, matchesBiodata: true },
        { key: 'certificate_number', value: 'CERT-2023-01',  confidence: 0.89, matchesBiodata: true },
      ];
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * verifyDocument — extracts fields (mock or real API) and compares them
 * against the applicant's entered biodata.
 */
export async function verifyDocument(
  documentType: DocumentType,
  file: PickedFile,
  biodata: Biodata,
): Promise<VerificationResult> {
  const startTime = Date.now();

  if (USE_MOCK) {
    // Simulate network + ML processing delay
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    const extractedFields = getMockFields(documentType);
    return compareFields(
      biodata,
      extractedFields,
      documentType,
      Date.now() - startTime,
    );
  }

  // Real API path
  const apiResponse = await extractDocumentFields({
    documentType,
    file: {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    },
  });

  const extractedFields: ExtractedField[] = apiResponse.fields.map((f) => ({
    key: f.key,
    value: f.value,
    confidence: f.confidence,
    matchesBiodata: true,
  }));

  return compareFields(
    biodata,
    extractedFields,
    documentType,
    apiResponse.processingTimeMs ?? Date.now() - startTime,
  );
}
