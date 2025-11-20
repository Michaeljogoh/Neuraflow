import { inngest } from "./client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("input", "5s");
    const { steps } = await step.ai.wrap("generate-ai", generateText, {
      model: google("gemini-2.5-flash-lite"),
      system: "You are a helpful assistant",
      prompt: "what is 4 + 4",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return steps;
  }
);
