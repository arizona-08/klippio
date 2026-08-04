ALTER TABLE "public"."User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "public"."MarkerPhoto" ADD COLUMN "uploadedById" INTEGER;
CREATE INDEX "MarkerPhoto_uploadedById_idx" ON "public"."MarkerPhoto"("uploadedById");
ALTER TABLE "public"."MarkerPhoto" ADD CONSTRAINT "MarkerPhoto_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "public"."PhotoReport" (
    "id" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photoId" TEXT NOT NULL,
    "reporterId" INTEGER NOT NULL,
    CONSTRAINT "PhotoReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PhotoReport_photoId_reporterId_key" ON "public"."PhotoReport"("photoId", "reporterId");
CREATE INDEX "PhotoReport_createdAt_idx" ON "public"."PhotoReport"("createdAt");
ALTER TABLE "public"."PhotoReport" ADD CONSTRAINT "PhotoReport_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "public"."MarkerPhoto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PhotoReport" ADD CONSTRAINT "PhotoReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
