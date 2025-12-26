-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_meetingId_fkey";

-- CreateIndex
CREATE INDEX "Availability_meetingId_idx" ON "Availability"("meetingId");

-- CreateIndex
CREATE INDEX "AvailabilityRange_availabilityId_idx" ON "AvailabilityRange"("availabilityId");

-- CreateIndex
CREATE INDEX "Comment_meetingId_idx" ON "Comment"("meetingId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Excuse_meetingId_idx" ON "Excuse"("meetingId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;
