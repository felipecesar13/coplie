// Cryptographic utilities for webhook signature verification
import { appConfig } from '../../config';

/**
 * Verify Linear webhook signature
 * Linear uses HMAC SHA256 for webhook signatures
 */
export async function verifyLinearWebhookSignature(body: string, signature: string | null): Promise<boolean> {
  const secret = appConfig.linear.webhookSecret;

  // If no secret is configured, skip verification (for development/testing)
  if (!secret) {
    return true;
  }

  // If secret is configured but no signature provided, reject
  if (!signature) {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
      'sign',
    ]);

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));

    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    return constantTimeCompare(computedSignature, signature);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Constant-time string comparison
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return crypto.randomUUID();
}
