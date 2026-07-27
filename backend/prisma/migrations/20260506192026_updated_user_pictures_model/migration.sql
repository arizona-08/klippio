/*
  Warnings:

  - The primary key for the `UserPictures` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserPictures` table. All the data in the column will be lost.
  - Made the column `type` on table `UserPictures` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."UserPictures" DROP CONSTRAINT "UserPictures_pkey",
DROP COLUMN "id",
ALTER COLUMN "type" SET NOT NULL,
ADD CONSTRAINT "UserPictures_pkey" PRIMARY KEY ("userId", "type");
