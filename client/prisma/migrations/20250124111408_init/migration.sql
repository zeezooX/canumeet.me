-- CreateTable
CREATE TABLE "Meeting" (
    "publicId" TEXT NOT NULL,
    "privateId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3),
    "durationMins" INTEGER,
    "availabilityEnabled" BOOLEAN NOT NULL,
    "availabilityDeadline" TIMESTAMP(3),
    "commentsEnabled" BOOLEAN NOT NULL,
    "updatesEnabled" BOOLEAN NOT NULL,
    "excusesEnabled" BOOLEAN NOT NULL,
    "availabilityStart" TIMESTAMP(3),
    "availabilityEnd" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("publicId")
);

-- CreateTable
CREATE TABLE "Availability" (
    "publicId" TEXT NOT NULL,
    "privateId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("publicId")
);

-- CreateTable
CREATE TABLE "Availability_Range" (
    "rangeId" INTEGER NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_Range_pkey" PRIMARY KEY ("rangeId")
);

-- CreateTable
CREATE TABLE "Excuse" (
    "excuseId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "Excuse_pkey" PRIMARY KEY ("excuseId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "isUpdate" BOOLEAN NOT NULL,
    "owner" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_publicId_key" ON "Meeting"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_privateId_key" ON "Meeting"("privateId");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_userId_key" ON "Meeting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_publicId_key" ON "Availability"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_privateId_key" ON "Availability"("privateId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_Range_rangeId_key" ON "Availability_Range"("rangeId");

-- CreateIndex
CREATE UNIQUE INDEX "Excuse_excuseId_key" ON "Excuse"("excuseId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_commentId_key" ON "Comment"("commentId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability_Range" ADD CONSTRAINT "Availability_Range_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availability"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excuse" ADD CONSTRAINT "Excuse_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("commentId") ON DELETE SET NULL ON UPDATE CASCADE;
