// This file configures the initialization of Sentry for edge features.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled } from "./sentry.env";

Sentry.init({
  dsn: "https://78242cc197bbd674512e3fc8628bb5d2@o4510358730833920.ingest.us.sentry.io/4510358780575744",
  enabled: isSentryEnabled,

  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
