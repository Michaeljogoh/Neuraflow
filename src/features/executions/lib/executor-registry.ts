import { NodeType } from "@/generated/prisma/enums";
import { manualTriggerExecutor } from "@/features/triggers/component/manual-trigger/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { openAiExecutor } from "../components/openai/executor";
import type { NodeExecutor } from "../types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.GEMINI]: geminiExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
