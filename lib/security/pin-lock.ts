/**
 * PIN Lock Security & Hashing Helper
 */
export async function hashPin(pin: string, salt: string = "my_finance_salt_2026"): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${pin}:${salt}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPin(
  enteredPin: string,
  storedHash: string,
  salt: string = "my_finance_salt_2026"
): Promise<boolean> {
  const computed = await hashPin(enteredPin, salt);
  return computed === storedHash;
}
