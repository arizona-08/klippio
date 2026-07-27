/*
  Warnings:

  - Made the column `folderId` on table `Plan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_folderId_fkey";

-- AlterTable
ALTER TABLE "public"."Plan" ALTER COLUMN "folderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
