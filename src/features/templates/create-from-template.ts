import { createId } from "@paralleldrive/cuid2";
import type { Prisma } from "@/generated/prisma/client";
import {
  getTemplateDefinition,
  isValidTemplateSlug,
  type TemplateSlug,
} from "./definitions";

export async function createWorkflowFromTemplate(
  tx: Prisma.TransactionClient,
  userId: string,
  templateSlug: TemplateSlug,
) {
  const definition = getTemplateDefinition(templateSlug);

  const nodeIdByKey = new Map<string, string>();
  for (const node of definition.nodes) {
    nodeIdByKey.set(node.key, createId());
  }

  const workflow = await tx.workflow.create({
    data: {
      name: definition.name,
      userId,
      templateSlug,
      nodes: {
        create: definition.nodes.map((node) => ({
          id: nodeIdByKey.get(node.key)!,
          name: node.type,
          type: node.type,
          position: node.position,
          data: (node.data ?? {}) as Prisma.InputJsonValue,
        })),
      },
    },
  });

  if (definition.edges.length > 0) {
    await tx.connection.createMany({
      data: definition.edges.map((edge) => ({
        workflowId: workflow.id,
        fromNodeId: nodeIdByKey.get(edge.from)!,
        toNodeId: nodeIdByKey.get(edge.to)!,
        fromOutput: edge.fromOutput ?? "main",
        toInput: edge.toInput ?? "main",
      })),
    });
  }

  return workflow;
}

export function assertValidTemplateSlug(
  slug: string,
): asserts slug is TemplateSlug {
  if (!isValidTemplateSlug(slug)) {
    throw new Error(`Unknown template slug: ${slug}`);
  }
}
