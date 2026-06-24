-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EXECUTION_FAILED', 'USAGE_DIGEST');

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requireCredentialReferences" BOOLEAN NOT NULL DEFAULT true,
    "blockUnsignedWebhooks" BOOLEAN NOT NULL DEFAULT true,
    "executionFailureAlerts" BOOLEAN NOT NULL DEFAULT true,
    "dailyUsageDigest" BOOLEAN NOT NULL DEFAULT false,
    "requireConfirmDestructive" BOOLEAN NOT NULL DEFAULT true,
    "runPreflightChecks" BOOLEAN NOT NULL DEFAULT true,
    "googleFormWebhookSecret" TEXT,
    "stripeWebhookSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
