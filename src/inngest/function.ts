import { inngest } from "./client";
import prisma from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "2s");

    await step.run('create-workflow', async () =>{
    return  await prisma.workflow.create({
      data: {
        name: "Workflow",
      },
    });
    })

    return { message: `Hello ${event.data.email}!` };
  },
);