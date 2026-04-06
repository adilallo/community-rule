import { createHash, randomBytes } from "crypto";

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export function hashSessionToken(token: string, pepper: string): string {
  return sha256Hex(`${pepper}:session:${token}`);
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}
