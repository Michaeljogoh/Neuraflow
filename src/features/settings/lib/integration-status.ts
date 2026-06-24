import { CredentialType, NodeType } from "@/generated/prisma/enums";
import prisma from "@/lib/db";

export type IntegrationKey = "openai" | "stripe" | "googleForms" | "slack";

export type IntegrationStatus = {
  key: IntegrationKey;
  label: string;
  connected: boolean;
  detail: string;
};

export async function getIntegrationStatus(
  userId: string,
): Promise<IntegrationStatus[]> {
  const [credentials, nodes] = await Promise.all([
    prisma.credential.findMany({
      where: { userId },
      select: { type: true },
    }),
    prisma.node.findMany({
      where: { workflow: { userId } },
      select: { type: true, data: true },
    }),
  ]);

  const credentialTypes = new Set(credentials.map((c) => c.type));
  const nodeTypes = new Set(nodes.map((n) => n.type));

  const slackConfigured = nodes.some(
    (n) =>
      n.type === NodeType.SLACK &&
      typeof (n.data as Record<string, unknown>)?.webhookUrl === "string" &&
      Boolean((n.data as Record<string, unknown>).webhookUrl),
  );

  return [
    {
      key: "openai",
      label: "OpenAI",
      connected:
        credentialTypes.has(CredentialType.OPENAI) ||
        credentialTypes.has(CredentialType.ANTHROPIC) ||
        credentialTypes.has(CredentialType.GEMINI),
      detail: credentialTypes.has(CredentialType.OPENAI)
        ? "Credential saved"
        : credentialTypes.has(CredentialType.ANTHROPIC) ||
            credentialTypes.has(CredentialType.GEMINI)
          ? "Other AI credentials saved"
          : "Add an AI credential",
    },
    {
      key: "stripe",
      label: "Stripe",
      connected: nodeTypes.has(NodeType.STRIPE_TRIGGER),
      detail: nodeTypes.has(NodeType.STRIPE_TRIGGER)
        ? "Stripe trigger in a workflow"
        : "Add a Stripe trigger workflow",
    },
    {
      key: "googleForms",
      label: "Google Forms",
      connected: nodeTypes.has(NodeType.GOOGLE_FORM_TRIGGER),
      detail: nodeTypes.has(NodeType.GOOGLE_FORM_TRIGGER)
        ? "Google Form trigger in a workflow"
        : "Add a Google Form trigger workflow",
    },
    {
      key: "slack",
      label: "Slack",
      connected: slackConfigured,
      detail: slackConfigured
        ? "Slack webhook configured"
        : "Configure a Slack node webhook",
    },
  ];
}
