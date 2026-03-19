-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentStoragKey" TEXT NOT NULL,
    "projectIdentifier" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Marker" (
    "id" TEXT NOT NULL,
    "coordX" DOUBLE PRECISION NOT NULL,
    "coordY" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT,
    "photoStorageKey" TEXT,
    "planIdentifier" TEXT NOT NULL,

    CONSTRAINT "Marker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarkerPhoto" (
    "id" TEXT NOT NULL,
    "photoStorageKey" TEXT NOT NULL,
    "markerIdentifier" TEXT NOT NULL,

    CONSTRAINT "MarkerPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_projectIdentifier_fkey" FOREIGN KEY ("projectIdentifier") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Marker" ADD CONSTRAINT "Marker_planIdentifier_fkey" FOREIGN KEY ("planIdentifier") REFERENCES "public"."Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarkerPhoto" ADD CONSTRAINT "MarkerPhoto_markerIdentifier_fkey" FOREIGN KEY ("markerIdentifier") REFERENCES "public"."Marker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
