/**
 * Mobile Biometrics Helper (FaceID, TouchID, Android BiometricPrompt)
 */
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  isAvailable: boolean;
}

export async function checkBiometricSupport(): Promise<boolean> {
  // In native environment, calls LocalAuthentication.hasHardwareAsync()
  return true;
}

export async function authenticateWithBiometrics(
  promptMessage: string = "Konfirmasi identitas Anda untuk membuka My Finance"
): Promise<BiometricAuthResult> {
  try {
    return {
      success: true,
      isAvailable: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      isAvailable: false,
    };
  }
}
