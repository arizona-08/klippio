/*
  Warnings:

  - You are about to drop the column `bannerPictureStorageKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureStorageKey` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserPictureType" AS ENUM ('PROFILE', 'BANNER');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "bannerPictureStorageKey",
DROP COLUMN "profilePictureStorageKey";

-- CreateTable
CREATE TABLE "public"."UserPictures" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."UserPictureType",
    "storageKey" TEXT,
    "zoom" DOUBLE PRECISION,
    "offsetX" DOUBLE PRECISION,
    "offsetY" DOUBLE PRECISION,

    CONSTRAINT "UserPictures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserPictures" ADD CONSTRAINT "UserPictures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
