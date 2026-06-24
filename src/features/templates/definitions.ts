import { NodeType } from "@/generated/prisma/enums";

export const TEMPLATE_SLUGS = [
  "lead-capture-slack",
  "support-triage-ai",
  "payment-success-workflow",
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

export type TemplateNodeBlueprint = {
  key: string;
  type: NodeType;
  position: { x: number; y: number };
  data?: Record<string, unknown>;
};

export type TemplateEdgeBlueprint = {
  from: string;
  to: string;
  fromOutput?: string;
  toInput?: string;
};

export type TemplateDefinition = {
  slug: TemplateSlug;
  title: string;
  description: string;
  category: "Sales" | "Support" | "Finance";
  name: string;
  nodes: TemplateNodeBlueprint[];
  edges: TemplateEdgeBlueprint[];
};

export const TEMPLATE_DEFINITIONS: Record<TemplateSlug, TemplateDefinition> = {
  "lead-capture-slack": {
    slug: "lead-capture-slack",
    title: "Lead capture to Slack",
    description: "Google Form trigger -> AI summary -> Slack alert",
    category: "Sales",
    name: "Lead capture to Slack",
    nodes: [
      {
        key: "trigger",
        type: NodeType.GOOGLE_FORM_TRIGGER,
        position: { x: 0, y: 0 },
        data: {},
      },
      {
        key: "summarize",
        type: NodeType.OPENAI,
        position: { x: 300, y: 0 },
        data: {
          variableName: "leadSummary",
          systemPrompt:
            "You summarize inbound leads for a sales team. Be concise and actionable.",
          userPrompt:
            "Summarize this Google Form submission:\n\n{{json googleForm}}",
        },
      },
      {
        key: "notify",
        type: NodeType.SLACK,
        position: { x: 600, y: 0 },
        data: {
          variableName: "slackAlert",
          content:
            "New lead from *{{googleForm.formTitle}}*\n\n{{leadSummary.text}}",
        },
      },
    ],
    edges: [
      { from: "trigger", to: "summarize" },
      { from: "summarize", to: "notify" },
    ],
  },
  "support-triage-ai": {
    slug: "support-triage-ai",
    title: "Support triage with AI",
    description: "Manual trigger -> OpenAI classification -> Discord routing",
    category: "Support",
    name: "Support triage with AI",
    nodes: [
      {
        key: "trigger",
        type: NodeType.MANUAL_TRIGGER,
        position: { x: 0, y: 0 },
        data: {},
      },
      {
        key: "classify",
        type: NodeType.OPENAI,
        position: { x: 300, y: 0 },
        data: {
          variableName: "ticketClassification",
          systemPrompt:
            "Classify support tickets as Billing, Technical, or General. Reply with one label and a one-sentence rationale.",
          userPrompt:
            "Classify this support request using the workflow context below:\n\n{{json this}}",
        },
      },
      {
        key: "route",
        type: NodeType.DISCORD,
        position: { x: 600, y: 0 },
        data: {
          variableName: "discordAlert",
          username: "Support Bot",
          content:
            "Support ticket triaged:\n\n{{ticketClassification.text}}",
        },
      },
    ],
    edges: [
      { from: "trigger", to: "classify" },
      { from: "classify", to: "route" },
    ],
  },
  "payment-success-workflow": {
    slug: "payment-success-workflow",
    title: "Payment success workflow",
    description: "Stripe event -> HTTP request -> CRM enrichment",
    category: "Finance",
    name: "Payment success workflow",
    nodes: [
      {
        key: "trigger",
        type: NodeType.STRIPE_TRIGGER,
        position: { x: 0, y: 0 },
        data: {},
      },
      {
        key: "crm",
        type: NodeType.HTTP_REQUEST,
        position: { x: 300, y: 0 },
        data: {
          variableName: "crmSync",
          method: "POST",
          endpoint: "https://api.example.com/crm/payments",
          body: '{\n  "eventType": "{{stripe.eventType}}",\n  "eventId": "{{stripe.eventId}}",\n  "payload": {{json stripe.raw}}\n}',
        },
      },
    ],
    edges: [{ from: "trigger", to: "crm" }],
  },
};

export const TEMPLATE_LIST = TEMPLATE_SLUGS.map(
  (slug) => TEMPLATE_DEFINITIONS[slug],
);

export function isValidTemplateSlug(slug: string): slug is TemplateSlug {
  return TEMPLATE_SLUGS.includes(slug as TemplateSlug);
}

export function getTemplateDefinition(slug: TemplateSlug): TemplateDefinition {
  return TEMPLATE_DEFINITIONS[slug];
}

export function getTemplateTitle(slug: string): string {
  if (!isValidTemplateSlug(slug)) return slug;
  return TEMPLATE_DEFINITIONS[slug].title;
}
