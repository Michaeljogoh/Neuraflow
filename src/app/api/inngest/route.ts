import { executeWorkflow } from "@/inngest/functions";
import { dailyUsageDigest } from "@/inngest/daily-usage-digest";
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow, dailyUsageDigest],
});
