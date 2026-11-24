/**
 * filePicker.ts — thin wrappers around expo-document-picker and
 * expo-image-picker. Returns a normalised { uri, name, mimeType } object
 * so the rest of the app doesn't depend on the library's raw result shape.
 *
 * No upload or processing happens here — this is purely the "pick a file" step.
 */

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/** Normalised file descriptor returned by both picker functions. */
export interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
}

// ---------------------------------------------------------------------------
// PDF / document picker
// ---------------------------------------------------------------------------

/**
 * pickDocument — opens the OS file browser filtered to PDF files.
 * Returns a PickedFile, or null if the user cancelled or an error occurred.
 */
export async function pickDocument(): Promise<PickedFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    // User cancelled
    if (result.canceled) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.name ?? 'document.pdf',
      mimeType: asset.mimeType ?? 'application/pdf',
    };
  } catch (err) {
    console.warn('[filePicker] pickDocument error:', err);
    Alert.alert('Error', 'Could not open the document picker. Please try again.');
    return null;
  }
}

// ---------------------------------------------------------------------------
// Image picker (camera roll or camera)
// ---------------------------------------------------------------------------

/**
 * pickImage — requests media library permission then opens the image picker.
 * Returns a PickedFile, or null if cancelled or permission denied.
 */
export async function pickImage(): Promise<PickedFile | null> {
  // Request permission to access the photo library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'DocVerify needs access to your photo library to pick an image. Please enable it in Settings.',
    );
    return null;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: false,
    });

    // User cancelled
    if (result.canceled) return null;

    const asset = result.assets[0];
    // Derive a file name from the URI if the picker doesn't provide one
    const name = asset.fileName ?? asset.uri.split('/').pop() ?? 'image.jpg';
    const mimeType = asset.mimeType ?? 'image/jpeg';

    return { uri: asset.uri, name, mimeType };
  } catch (err) {
    console.warn('[filePicker] pickImage error:', err);
    Alert.alert('Error', 'Could not open the image picker. Please try again.');
    return null;
  }
}

/**
 * takePhoto — requests camera permission then opens the camera.
 * Returns a PickedFile, or null if cancelled or permission denied.
 */
export async function takePhoto(): Promise<PickedFile | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'DocVerify needs camera access to take a photo of your document. Please enable it in Settings.',
    );
    return null;
  }

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true, // let user crop after capture
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    const name = asset.fileName ?? `photo_${Date.now()}.jpg`;
    const mimeType = asset.mimeType ?? 'image/jpeg';

    return { uri: asset.uri, name, mimeType };
  } catch (err) {
    console.warn('[filePicker] takePhoto error:', err);
    Alert.alert('Error', 'Could not open the camera. Please try again.');
    return null;
  }
}
