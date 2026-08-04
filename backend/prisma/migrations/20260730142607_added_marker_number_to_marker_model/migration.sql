/*
  Warnings:

  - A unique constraint covering the columns `[planId,markerNumber]` on the table `Marker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Marker" ADD COLUMN     "markerNumber" INTEGER;

-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "nextMarkerNumber" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Marker_planId_markerNumber_key" ON "public"."Marker"("planId", "markerNumber");
