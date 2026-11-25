/// <reference types="jest" />
import {
  compareFields,
  fuzzyNameMatch,
  normalizeDate,
  normalizeText,
} from '../compareFields';
import { Biodata } from '../../types/biodata';
import { ExtractedField } from '../../types/document';

describe('compareFields utilities', () => {
  it('normalizes whitespace, case, and punctuation', () => {
    expect(normalizeText('  AAYUSH   SINGH. ')).toBe('aayush singh');
  });

  it('normalizes DD/MM/YYYY and YYYY-MM-DD dates to the same format', () => {
    expect(normalizeDate('15/08/2000')).toBe('2000-08-15');
    expect(normalizeDate('2000-08-15')).toBe('2000-08-15');
    expect(normalizeDate('15-08-2000')).toBe('2000-08-15');
  });

  it('matches names with extra spaces, different casing, and minor typos', () => {
    expect(fuzzyNameMatch('Aayush Singh', 'AAYUSH  SINGH')).toBe(true);
    expect(fuzzyNameMatch('Aayush Singh', 'Ayush Singh')).toBe(true);
    expect(fuzzyNameMatch('Aayush Singh', 'Rahul Verma')).toBe(false);
  });

  it('returns verified status when all biodata-linked fields match', () => {
    const biodata: Biodata = {
      fullName: 'Aayush Singh',
      dateOfBirth: '15/08/2000',
      fatherName: 'Rajesh Singh',
      documentReference: '7.8',
    };

    const extracted: ExtractedField[] = [
      { key: 'candidate_name', value: 'AAYUSH  SINGH', confidence: 0.98, matchesBiodata: false },
      { key: 'father_name', value: 'Rajesh Singh.', confidence: 0.95, matchesBiodata: false },
      { key: 'date_of_birth', value: '2000-08-15', confidence: 0.96, matchesBiodata: false },
      { key: 'cgpa', value: '7.80', confidence: 0.94, matchesBiodata: false },
    ];

    const result = compareFields(biodata, extracted, 'marksheet', 120);
    expect(result.status).toBe('verified');
    expect(result.mismatches).toHaveLength(0);
    expect(result.extractedFields.every((f) => f.matchesBiodata)).toBe(true);
  });

  it('flags mismatches when biodata differs from extracted fields', () => {
    const biodata: Biodata = {
      fullName: 'Aayush Singh',
      dateOfBirth: '15/08/2000',
      fatherName: 'Rajesh Singh',
      documentReference: '8.5',
    };

    const extracted: ExtractedField[] = [
      { key: 'candidate_name', value: 'Aayush Singh', confidence: 0.98, matchesBiodata: true },
      { key: 'date_of_birth', value: '1999-01-01', confidence: 0.95, matchesBiodata: true },
      { key: 'cgpa', value: '7.8', confidence: 0.92, matchesBiodata: true },
    ];

    const result = compareFields(biodata, extracted, 'marksheet', 150);
    expect(result.status).toBe('mismatch');
    expect(result.mismatches.map((m) => m.key)).toEqual(['date_of_birth', 'cgpa']);
  });
});
