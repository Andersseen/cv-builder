/**
 * Generates a cryptographically strong unique ID.
 * Uses the built-in Web Crypto API (supported in all modern browsers).
 */
export function generateId(): string {
  return crypto.randomUUID();
}
