import crypto from "node:crypto";

export function verifyGoogleFormWebhookSecret(
  headerSecret: string | null,
  expectedSecret: string | null | undefined,
): boolean {
  if (!expectedSecret || !headerSecret) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(headerSecret),
      Buffer.from(expectedSecret),
    );
  } catch {
    return false;
  }
}

export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | null | undefined,
): boolean {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(",").reduce<Record<string, string>>(
    (acc, part) => {
      const [key, value] = part.split("=");
      if (key && value) acc[key] = value;
      return acc;
    },
    {},
  );

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}
