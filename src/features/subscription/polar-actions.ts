import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function formatPolarError(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      const message = error.message;

      if (message.includes("Product does not exist")) {
        return "Pro plan not found in Polar. Set POLAR_PRO_PRODUCT_ID in .env to your sandbox product id.";
      }

      if (message.includes("invalid_token")) {
        return "Polar access token is invalid. Create a new token at sandbox.polar.sh.";
      }

      return message;
    }

    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
  }

  return fallback;
}

async function ensurePolarCustomerLinked(): Promise<void> {
  const response = await fetch("/api/polar/ensure-customer", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Failed to sync your billing account with Polar.");
  }
}

export async function fetchCustomerState() {
  await ensurePolarCustomerLinked();

  const { data, error } = await authClient.customer.state();

  if (error) {
    throw error;
  }

  return data;
}

export async function startProCheckout() {
  try {
    await ensurePolarCustomerLinked();

    const { error } = await authClient.checkout({ slug: "pro" });

    if (error) {
      toast.error(formatPolarError(error, "Checkout failed. Please try again."));
      return;
    }
  } catch (error) {
    toast.error(formatPolarError(error, "Checkout failed. Please try again."));
  }
}

export async function openBillingPortal() {
  try {
    await ensurePolarCustomerLinked();

    const { error } = await authClient.customer.portal();

    if (error) {
      toast.error(formatPolarError(error, "Could not open billing portal."));
    }
  } catch (error) {
    toast.error(formatPolarError(error, "Could not open billing portal."));
  }
}
