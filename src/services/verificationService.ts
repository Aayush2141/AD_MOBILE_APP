/**
 * verificationService.ts — MOCK document verification service.
 *
 * ⚠️  ALL DATA RETURNED HERE IS HARDCODED PLACEHOLDER DATA.
 *     This function simulates network + ML latency with a setTimeout.
 *     Replace the body of verifyDocument() with a real IDP API call
 *     once the extraction backend is available.
 */

import { DocumentType, ExtractedField, VerificationResult } from '../types/document';

// ---------------------------------------------------------------------------
// Mock field banks per document type
// ---------------------------------------------------------------------------

/** Returns a set of hardcoded ExtractedField objects for the given type. */
function getMockFields(type: DocumentType): ExtractedField[] {
  switch (type) {
    case 'marksheet':
      return [
        { key: 'candidate_name',   value: 'Rahul Sharma',          confidence: 0.97, matchesBiodata: true  },
        { key: 'roll_number',      value: 'MTK2019045',             confidence: 0.95, matchesBiodata: true  },
        { key: 'cgpa',             value: '7.8',                    confidence: 0.92, matchesBiodata: false }, // mismatch: biodata says 8.1
        { key: 'university',       value: 'Delhi Technological Univ.', confidence: 0.98, matchesBiodata: true  },
      ];
    case 'gate':
      return [
        { key: 'candidate_name',   value: 'Rahul Sharma',          confidence: 0.96, matchesBiodata: true  },
        { key: 'gate_score',       value: '712',                   confidence: 0.99, matchesBiodata: false }, // mismatch: biodata says 720
        { key: 'gate_rank',        value: '1240',                  confidence: 0.94, matchesBiodata: true  },
        { key: 'discipline',       value: 'Electronics & Comm.',   confidence: 0.97, matchesBiodata: true  },
      ];
    default:
      // Generic fields for all other types
      return [
        { key: 'candidate_name',   value: 'Rahul Sharma',          confidence: 0.97, matchesBiodata: true  },
        { key: 'issue_date',       value: '2023-06-15',            confidence: 0.91, matchesBiodata: true  },
        { key: 'issuing_authority', value: 'State Government',     confidence: 0.88, matchesBiodata: false }, // mismatch
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
 * @returns             A resolved VerificationResult after ~1 s simulated delay.
 *
 * TODO: Replace with:
 *   const response = await fetch(IDP_API_URL, { method: 'POST', body: formData });
 *   return response.json() as VerificationResult;
 */
export async function verifyDocument(
  documentType: DocumentType,
  fileUri: string,
): Promise<VerificationResult> {
  const startTime = Date.now();

  // Simulate network + ML processing delay (target is <3 s in production)
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));

  const extractedFields = getMockFields(documentType);
  const mismatches = extractedFields.filter((f) => !f.matchesBiodata);

  const status =
    mismatches.length === 0
      ? 'verified'
      : mismatches.length === extractedFields.length
      ? 'failed'
      : 'mismatch';

  return {
    id: `mock-${Date.now()}`,
    documentType,
    status,
    extractedFields,
    mismatches,
    verifiedAt: new Date().toISOString(),
    processingTimeMs: Date.now() - startTime,
  };
}
