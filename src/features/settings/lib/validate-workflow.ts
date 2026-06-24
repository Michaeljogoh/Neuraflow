import { NodeType } from "@/generated/prisma/enums";

const AI_NODE_TYPES = new Set<NodeType>([
  NodeType.OPENAI,
  NodeType.ANTHROPIC,
  NodeType.GEMINI,
]);

const INLINE_SECRET_PATTERN = /sk-[a-zA-Z0-9]{10,}/;

type WorkflowNodeInput = {
  type?: string | null;
  data?: Record<string, unknown>;
};

export function validateWorkflowNodes(
  nodes: WorkflowNodeInput[],
  options: {
    requireCredentialReferences: boolean;
    runPreflightChecks: boolean;
  },
): string[] {
  const errors: string[] = [];

  for (const node of nodes) {
    const type = node.type as NodeType | undefined;
    if (!type || type === NodeType.INITIAL) continue;

    const data = node.data ?? {};

    if (options.requireCredentialReferences && AI_NODE_TYPES.has(type)) {
      if (!data.credentialId || typeof data.credentialId !== "string") {
        errors.push(`${type} node requires a stored credential reference.`);
      }

      if (INLINE_SECRET_PATTERN.test(JSON.stringify(data))) {
        errors.push(
          `${type} node must not contain plain-text API keys. Use Credentials instead.`,
        );
      }
    }

    if (!options.runPreflightChecks) continue;

    switch (type) {
      case NodeType.OPENAI:
      case NodeType.ANTHROPIC:
      case NodeType.GEMINI:
        if (!data.userPrompt || typeof data.userPrompt !== "string") {
          errors.push(`${type} node is missing a user prompt.`);
        }
        if (options.requireCredentialReferences && !data.credentialId) {
          errors.push(`${type} node is missing a credential.`);
        }
        break;
      case NodeType.SLACK:
      case NodeType.DISCORD:
        if (!data.webhookUrl) {
          errors.push(`${type} node is missing a webhook URL.`);
        }
        if (!data.content) {
          errors.push(`${type} node is missing message content.`);
        }
        if (!data.variableName) {
          errors.push(`${type} node is missing a variable name.`);
        }
        break;
      case NodeType.HTTP_REQUEST:
        if (!data.endpoint) {
          errors.push("HTTP Request node is missing an endpoint URL.");
        }
        if (!data.variableName) {
          errors.push("HTTP Request node is missing a variable name.");
        }
        break;
      default:
        break;
    }
  }

  return errors;
}
