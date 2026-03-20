/*
  Warnings:

  - You are about to drop the column `documentStoragKey` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `documentStorageKey` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Plan" DROP COLUMN "documentStoragKey",
ADD COLUMN     "documentStorageKey" TEXT NOT NULL;
