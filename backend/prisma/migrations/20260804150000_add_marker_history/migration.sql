CREATE TYPE "public"."MarkerHistoryAction" AS ENUM ('PHOTO_ADDED', 'PHOTO_DELETED', 'PHOTO_LABEL_UPDATED', 'PHOTO_COMMENT_UPDATED');

CREATE TABLE "public"."MarkerHistory" (
    "id" TEXT NOT NULL,
    "markerId" TEXT NOT NULL,
    "actorId" INTEGER NOT NULL,
    "action" "public"."MarkerHistoryAction" NOT NULL,
    "photoId" TEXT,
    "photoStorageKey" TEXT NOT NULL,
    "oldLabel" TEXT,
    "newLabel" TEXT,
    "oldComment" TEXT,
    "newComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MarkerHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarkerHistory_markerId_createdAt_idx" ON "public"."MarkerHistory"("markerId", "createdAt");
ALTER TABLE "public"."MarkerHistory" ADD CONSTRAINT "MarkerHistory_markerId_fkey" FOREIGN KEY ("markerId") REFERENCES "public"."Marker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."MarkerHistory" ADD CONSTRAINT "MarkerHistory_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
