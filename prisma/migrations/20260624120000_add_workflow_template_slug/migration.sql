-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN "templateSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_userId_templateSlug_key" ON "Workflow"("userId", "templateSlug");
