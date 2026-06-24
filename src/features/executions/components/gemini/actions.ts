"use server";

import { geminiChannel } from "@/inngest/channels/gemini";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchGeminiRealtimeToken() {
  return fetchSubscriptionToken(geminiChannel(), ["status"]);
}
