"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "./client";

export async function fetchSubscriptionToken(
  channel: Parameters<typeof getSubscriptionToken>[1]["channel"],
  topics: ["status"],
): Promise<Realtime.Subscribe.Token | null> {
  try {
    return await getSubscriptionToken(inngest, { channel, topics });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[inngest] Realtime unavailable. Start Inngest dev with `pnpm inngest:dev` or `pnpm dev:all`.",
        error,
      );
    }
    return null;
  }
}
