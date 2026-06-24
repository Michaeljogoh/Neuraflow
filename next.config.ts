import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { isSentryEnabled } from "./sentry.env";

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default withSentryConfig(nextConfig, {
  org: "test-avn",
  project: "neuraflow",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: isSentryEnabled ? "/monitoring" : undefined,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});
