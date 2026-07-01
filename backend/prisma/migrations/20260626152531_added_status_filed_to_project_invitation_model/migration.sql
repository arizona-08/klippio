/*
  Warnings:

  - You are about to drop the column `accepted` on the `ProjectInvitation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ProjectInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "public"."ProjectInvitation" DROP COLUMN "accepted",
ADD COLUMN     "status" "public"."ProjectInvitationStatus" NOT NULL DEFAULT 'PENDING';
