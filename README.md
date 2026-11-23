# DocVerify

**Intelligent Document Verification for DRDO RAC**

## Problem

DRDO's Recruitment and Assessment Centre (RAC) verifies candidate documents
(educational certificates, marksheets, GATE scorecards, experience, caste, EWS,
and PwD certificates) manually — a slow and error-prone process. DocVerify is a
React Native mobile app that lets an applicant upload or scan a document (image or
PDF, possibly in languages other than Hindi or English), extract key fields using
Intelligent Document Processing, compare them against the biodata the applicant
entered, and alert them to any mismatch. Target: Three Sigma accuracy and under
3 seconds per document. Extracted data is displayed in an in-app dashboard.

---

## Tech Stack

- **React Native** (Expo managed workflow, TypeScript)
- **React Navigation** (stack navigator)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code
with the **Expo Go** app on your device.

---

## Project Structure (after Commit 2)

```
src/
  screens/        # HomeScreen, UploadScreen, ResultScreen
  components/     # Shared UI components
  navigation/     # Stack navigator setup
  services/       # API / ML service calls (future)
  utils/          # Helper functions (future)
  types/          # TypeScript type definitions
  constants/      # Theme, colors, spacing
```
