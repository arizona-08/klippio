CREATE TYPE "public"."SupportTicketStatus" AS ENUM ('OPEN', 'RESOLVED', 'CLOSED');

CREATE TABLE "public"."SupportTicket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "public"."SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."SupportMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SupportTicket_authorId_updatedAt_idx" ON "public"."SupportTicket"("authorId", "updatedAt");
CREATE INDEX "SupportTicket_status_updatedAt_idx" ON "public"."SupportTicket"("status", "updatedAt");
CREATE INDEX "SupportMessage_ticketId_createdAt_idx" ON "public"."SupportMessage"("ticketId", "createdAt");
ALTER TABLE "public"."SupportTicket" ADD CONSTRAINT "SupportTicket_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."SupportMessage" ADD CONSTRAINT "SupportMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
