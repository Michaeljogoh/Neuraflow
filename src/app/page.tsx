import type { Metadata } from "next";
import { LandingPage } from "@/features/marketing/components/landing-page";

export const metadata: Metadata = {
  title: "Neuraflow — Visual Workflow Automation",
  description:
    "Design triggers, AI steps, and integrations on a canvas. Neuraflow executes workflows with durable runs, encrypted credentials, and live status updates.",
  openGraph: {
    title: "Neuraflow — Visual Workflow Automation",
    description:
      "The visual platform for workflow automation. Build, run, and monitor automations without glue code.",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
