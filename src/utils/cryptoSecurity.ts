/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * High-security cryptographic hashing using standard Web Crypto API (SHA-256).
 * No third-party dependencies required. Zero plain-text persistence.
 */

const SECURITY_PEPPER = 'sapataria_liberdade_artisan_secure_pepper_9e399241';

/**
 * Computes an irreversible SHA-256 cryptographic hash of the input string
 * combined with a proprietary pepper to thwart rainbow-table attacks.
 */
export async function computeSHA256(input: string): Promise<string> {
  const normalized = input.trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${SECURITY_PEPPER}::${normalized}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Formats a raw 11-digit CPF into the standard 000.000.000-00 display format.
 */
export function formatCPF(val: string): string {
  const raw = val.replace(/\D/g, '').slice(0, 11);
  if (raw.length <= 3) return raw;
  if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
  if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
  return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
}

/**
 * Masks a CPF so only the first and last digits are visible (e.g. 123.***.***-00).
 */
export function maskCPF(val: string): string {
  const raw = val.replace(/\D/g, '');
  if (raw.length !== 11) return '***.***.***-**';
  return `${raw.slice(0, 3)}.***.***-${raw.slice(9, 11)}`;
}
