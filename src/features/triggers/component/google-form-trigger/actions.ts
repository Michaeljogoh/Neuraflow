"use server";

import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchGoogleFormTriggerRealtimeToken() {
  return fetchSubscriptionToken(googleFormTriggerChannel(), ["status"]);
}
