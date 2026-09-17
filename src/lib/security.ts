/**
 * @file security.ts
 * @description Security utilities: CSRF check, Input Sanitization, Security Headers.
 */

import { NextRequest } from "next/server";

/**
 * Sanitizes user input string by stripping script tags and unsafe HTML.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/onerror\s*=/gi, "")
    .trim();
}

/**
 * Validates request origin against allowed host to prevent CSRF attacks.
 */
export function validateCsrfOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    // Non-browser or server-to-server request
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host || host.includes("localhost") || host.includes("127.0.0.1") || host.includes("vercel.app");
  } catch {
    return false;
  }
}

/**
 * Standard Security Headers map for API responses.
 */
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
