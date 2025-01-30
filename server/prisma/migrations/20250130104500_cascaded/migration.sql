/*
  Warnings:

  - You are about to drop the `Availability_Range` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "Availability_Range" DROP CONSTRAINT "Availability_Range_availabilityId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Excuse" DROP CONSTRAINT "Excuse_meetingId_fkey";

-- DropTable
DROP TABLE "Availability_Range";

-- CreateTable
CREATE TABLE "AvailabilityRange" (
    "rangeId" INTEGER NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityRange_pkey" PRIMARY KEY ("rangeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityRange_rangeId_key" ON "AvailabilityRange"("rangeId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRange" ADD CONSTRAINT "AvailabilityRange_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availability"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excuse" ADD CONSTRAINT "Excuse_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;
