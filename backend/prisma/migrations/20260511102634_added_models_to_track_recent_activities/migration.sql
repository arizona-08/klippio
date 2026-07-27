-- CreateTable
CREATE TABLE "public"."RecentActivity" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsersActivity" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "UsersActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UsersActivity" ADD CONSTRAINT "UsersActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsersActivity" ADD CONSTRAINT "UsersActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."RecentActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
