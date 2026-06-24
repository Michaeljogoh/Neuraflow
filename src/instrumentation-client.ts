// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled } from "../sentry.env";

Sentry.init({
  dsn: "https://78242cc197bbd674512e3fc8628bb5d2@o4510358730833920.ingest.us.sentry.io/4510358780575744",
  enabled: isSentryEnabled,

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 1,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = isSentryEnabled
  ? Sentry.captureRouterTransitionStart
  : () => {};
