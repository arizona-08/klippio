/*
  Warnings:

  - You are about to drop the column `comment` on the `Marker` table. All the data in the column will be lost.
  - Added the required column `photoLabel` to the `MarkerPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Marker" DROP COLUMN "comment";

-- AlterTable
ALTER TABLE "public"."MarkerPhoto" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "photoLabel" TEXT NOT NULL;
