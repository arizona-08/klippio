/*
  Warnings:

  - Added the required column `planPageNumber` to the `Marker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Marker" ADD COLUMN     "planPageNumber" INTEGER NOT NULL;
