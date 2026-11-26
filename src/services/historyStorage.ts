/**
 * historyStorage.ts — Local persistence for verification scan history
 * using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DocumentType, VerificationResult } from '../types/document';

const HISTORY_STORAGE_KEY = '@docverify/scan_history';

export interface HistoryEntry {
  id: string;
  documentType: DocumentType;
  fileName: string;
  timestamp: string;
  matchedFields: number;
  totalFields: number;
}

/**
 * Loads all saved verification history entries (newest first).
 */
export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch (err) {
    console.warn('[historyStorage] loadHistory failed:', err);
    return [];
  }
}

/**
 * Saves a completed VerificationResult to local history (prepends newest entry).
 */
export async function saveHistoryEntry(
  result: VerificationResult,
  fileName: string,
): Promise<void> {
  try {
    const existing = await loadHistory();
    const totalFields = result.extractedFields.length;
    const matchedFields = totalFields - result.mismatches.length;

    const entry: HistoryEntry = {
      id: result.id,
      documentType: result.documentType,
      fileName,
      timestamp: result.verifiedAt,
      matchedFields,
      totalFields,
    };

    const updated = [entry, ...existing];
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[historyStorage] saveHistoryEntry failed:', err);
  }
}
