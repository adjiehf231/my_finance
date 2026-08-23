/**
 * SecureStore Adapter for JWT Tokens & Sensitive Session Data
 */
export const SECURE_KEYS = {
  AUTH_TOKEN: "my_finance_auth_token",
  REFRESH_TOKEN: "my_finance_refresh_token",
  ACTIVE_FAMILY_ID: "my_finance_active_family_id",
  BIOMETRIC_ENABLED: "my_finance_biometric_enabled",
};

export interface SecureStorageProvider {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}

// In-memory fallback provider when running in non-native / test environments
const memoryStorage = new Map<string, string>();

export const memorySecureStore: SecureStorageProvider = {
  async getItem(key: string) {
    return memoryStorage.get(key) || null;
  },
  async setItem(key: string, value: string) {
    memoryStorage.set(key, value);
  },
  async deleteItem(key: string) {
    memoryStorage.delete(key);
  },
};
