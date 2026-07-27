-- CreateEnum
CREATE TYPE "public"."CollaboratorRole" AS ENUM ('VIEWER', 'EDITOR', 'OWNER');

-- CreateTable
CREATE TABLE "public"."ProjectCollaborator" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "public"."CollaboratorRole" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "ProjectCollaborator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProjectCollaborator" ADD CONSTRAINT "ProjectCollaborator_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectCollaborator" ADD CONSTRAINT "ProjectCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
