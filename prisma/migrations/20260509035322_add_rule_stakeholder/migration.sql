-- CreateTable
CREATE TABLE "RuleStakeholder" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitedByUserId" TEXT,
    "userId" TEXT,
    "inviteTokenHash" TEXT,
    "inviteExpiresAt" TIMESTAMP(3),
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "RuleStakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RuleStakeholder_inviteTokenHash_key" ON "RuleStakeholder"("inviteTokenHash");

-- CreateIndex
CREATE INDEX "RuleStakeholder_userId_idx" ON "RuleStakeholder"("userId");

-- CreateIndex
CREATE INDEX "RuleStakeholder_email_idx" ON "RuleStakeholder"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RuleStakeholder_ruleId_email_key" ON "RuleStakeholder"("ruleId", "email");

-- AddForeignKey
ALTER TABLE "RuleStakeholder" ADD CONSTRAINT "RuleStakeholder_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "PublishedRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleStakeholder" ADD CONSTRAINT "RuleStakeholder_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleStakeholder" ADD CONSTRAINT "RuleStakeholder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
