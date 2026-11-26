/**
 * api.ts — Request and response contracts for the DocVerify IDP backend.
 */

import { DocumentType } from './document';

/** Multipart upload payload sent to POST /api/v1/verify */
export interface ExtractDocumentRequest {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  documentType: DocumentType;
}

/** Single field returned by the extraction API (before biodata comparison). */
export interface ApiExtractedField {
  key: string;
  value: string;
  /** Model confidence score in [0, 1] */
  confidence: number;
}

/** JSON response returned by POST /api/v1/verify */
export interface ExtractDocumentResponse {
  documentType: DocumentType;
  fields: ApiExtractedField[];
  processingTimeMs?: number;
}
