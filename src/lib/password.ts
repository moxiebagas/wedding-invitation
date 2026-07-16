import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

/** Hash a password as "saltHex:hashHex" using Node's built-in scrypt (no extra dependency). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const candidateBuf = scryptSync(password, salt, KEY_LENGTH);
  if (candidateBuf.length !== hashBuf.length) return false;
  return timingSafeEqual(candidateBuf, hashBuf);
}

/**
 * A valid-shaped but unusable hash. Run through verifyPassword() on a login
 * miss (unknown username) so the response takes roughly the same time as a
 * real check — otherwise timing would reveal which usernames exist.
 */
export const DUMMY_PASSWORD_HASH = hashPassword(randomBytes(24).toString("hex"));
