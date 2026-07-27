/*
  Warnings:

  - You are about to drop the column `photoStorageKey` on the `Marker` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `city` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Marker" DROP COLUMN "photoStorageKey";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "title",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "zipcode" TEXT NOT NULL;
