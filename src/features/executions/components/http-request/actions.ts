"use server";

import { httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchSubscriptionToken } from "@/inngest/fetch-subscription-token";

export async function fetchHttpRequestRealtimeToken() {
  return fetchSubscriptionToken(httpRequestChannel(), ["status"]);
}
