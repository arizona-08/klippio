/*
  Warnings:

  - You are about to drop the column `planIdentifier` on the `Marker` table. All the data in the column will be lost.
  - You are about to drop the column `markerIdentifier` on the `MarkerPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `projectIdentifier` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `planId` to the `Marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markerId` to the `MarkerPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Marker" DROP CONSTRAINT "Marker_planIdentifier_fkey";

-- DropForeignKey
ALTER TABLE "public"."MarkerPhoto" DROP CONSTRAINT "MarkerPhoto_markerIdentifier_fkey";

-- DropForeignKey
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_projectIdentifier_fkey";

-- AlterTable
ALTER TABLE "public"."Marker" DROP COLUMN "planIdentifier",
ADD COLUMN     "planId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."MarkerPhoto" DROP COLUMN "markerIdentifier",
ADD COLUMN     "markerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Plan" DROP COLUMN "projectIdentifier",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Marker" ADD CONSTRAINT "Marker_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarkerPhoto" ADD CONSTRAINT "MarkerPhoto_markerId_fkey" FOREIGN KEY ("markerId") REFERENCES "public"."Marker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
