/**
 * apiClient.ts — Thin fetch wrapper for the DocVerify IDP backend.
 *
 * Uses EXPO_PUBLIC_API_URL from config.ts and enforces a 10-second timeout
 * via AbortController.
 */

import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/config';
import {
  ExtractDocumentRequest,
  ExtractDocumentResponse,
} from '../types/api';

/** Custom error class for API and timeout failures. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Uploads a document (multipart/form-data) + documentType to the IDP backend
 * and returns the extracted fields with confidence scores.
 */
export async function extractDocumentFields(
  payload: ExtractDocumentRequest,
): Promise<ExtractDocumentResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const formData = new FormData();
  // React Native's FormData accepts { uri, name, type } for file uploads
  formData.append('file', {
    uri: payload.file.uri,
    name: payload.file.name,
    type: payload.file.type,
  } as unknown as Blob);
  formData.append('documentType', payload.documentType);

  const url = `${API_BASE_URL.replace(/\/$/, '')}/api/v1/verify`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `Server responded with status ${response.status}.`,
        response.status,
      );
    }

    const data = (await response.json()) as ExtractDocumentResponse;
    if (!Array.isArray(data.fields)) {
      throw new ApiError('Invalid response format from verification server.');
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(
        'The verification request timed out after 10 seconds. Please try again.',
      );
    }
    throw new ApiError(
      'Unable to reach the verification server. Check your network connection and API URL.',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
