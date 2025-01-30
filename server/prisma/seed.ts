import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding data...');

  // Create a sample meeting
  const meeting1 = await prisma.meeting.create({
    data: {
      publicId: '000000',
      privateId: '000000abcdef',
      name: 'Team Sync',
      description: 'Weekly team meeting to discuss progress and roadblocks',
      owner: 'Alice',
      availabilityEnabled: true,
      commentsEnabled: false,
      updatesEnabled: false,
      excusesEnabled: false,
      availabilityStart: new Date(),
      availabilityEnd: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
      durationMins: 60,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      publicId: '000001',
      privateId: '000001abcdef',
      name: 'Client Call',
      description: 'Monthly call with client to discuss project updates',
      owner: 'Bob',
      availabilityEnabled: true,
      commentsEnabled: false,
      updatesEnabled: false,
      excusesEnabled: false,
      availabilityStart: new Date(),
      availabilityEnd: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
      durationMins: 30,
    },
  });

  console.log(`Created meetings: ${meeting1.name}, ${meeting2.name}`);

  // Add availabilities for the meeting
  const availability1 = await prisma.availability.create({
    data: {
      publicId: '00000000',
      privateId: '00000000abcdefgh',
      owner: 'Bob',
      meetingId: meeting1.publicId,
      message: 'Please have a break in between',
    },
  });

  const availability2 = await prisma.availability.create({
    data: {
      publicId: '00000001',
      privateId: '00000001abcdefgh',
      owner: 'Charlie',
      meetingId: meeting1.publicId,
      message: 'No comments',
    },
  });

  console.log(
    `Added availabilities: ${availability1.publicId}, ${availability2.publicId}`,
  );

  // Add availability ranges
  await prisma.availabilityRange.createMany({
    data: [
      {
        availabilityId: availability1.publicId,
        startTime: new Date(new Date().setHours(9, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 9:00 AM + 2 days
        endTime: new Date(new Date().setHours(11, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 11:00 AM + 2 days
        rangeId: 1,
      },
      {
        availabilityId: availability1.publicId,
        startTime: new Date(new Date().setHours(14, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 2:00 PM + 2 days
        endTime: new Date(new Date().setHours(16, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 4:00 PM + 2 days
        rangeId: 2,
      },
      {
        availabilityId: availability2.publicId,
        startTime: new Date(new Date().setHours(10, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 10:00 AM + 2 days
        endTime: new Date(new Date().setHours(12, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 12:00 PM + 2 days
        rangeId: 3,
      },
      {
        availabilityId: availability2.publicId,
        startTime: new Date(new Date().setHours(15, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 3:00 PM + 2 days
        endTime: new Date(new Date().setHours(17, 0, 0) + 24 * 60 * 60 * 1000 * 2), // 5:00 PM + 2 days
        rangeId: 4,
      },
    ],
  });

  console.log('Added availability ranges.');
}

seed()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
