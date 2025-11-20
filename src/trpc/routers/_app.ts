import { inngest } from "@/inngest/client";
import { protectedProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({
      where: { id: ctx.auth.user.id },
    });
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async () => {
    
    inngest.send({
      name:"test/hello.world",
      data:{
        email:"mjogoh@gmail.com"
      }
    })
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
