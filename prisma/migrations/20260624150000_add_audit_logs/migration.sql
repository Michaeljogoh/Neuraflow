-- CreateEnum
CREATE TYPE "AuditLogAction" AS ENUM ('WORKFLOW_CREATED', 'WORKFLOW_UPDATED', 'WORKFLOW_DELETED', 'WORKFLOW_EXECUTED', 'WORKFLOW_TEMPLATE_USED', 'CREDENTIAL_CREATED', 'CREDENTIAL_UPDATED', 'CREDENTIAL_DELETED', 'SETTINGS_UPDATED', 'WEBHOOK_BLOCKED');

-- CreateEnum
CREATE TYPE "AuditLogStatus" AS ENUM ('SUCCESS', 'PREVENTED', 'FAILED');

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "action" "AuditLogAction" NOT NULL,
    "target" TEXT NOT NULL,
    "status" "AuditLogStatus" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_userId_createdAt_idx" ON "audit_log"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
