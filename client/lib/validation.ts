import prisma from '@/lib/prisma';

/**
 * Get the public ID from the private ID
 * @param privateId - The private ID
 * @param length - The length of the private ID, 12 for meetings and 16 for availabilities
 * @returns The public ID
 */
export async function getPublicId(privateId: string, length: number = 12): Promise<string> {
  if (privateId.length === 12 && length === 12) {
    const publicId = privateId.slice(0, 6);

    const meeting = await prisma.meeting.findUnique({
      where: { publicId },
    });

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    if (meeting.privateId !== privateId) {
      throw new Error('Invalid Private ID');
    }

    return publicId;
  }

  if (privateId.length === 16 && length === 16) {
    const publicId = privateId.slice(0, 8);

    const availability = await prisma.availability.findUnique({
      where: { publicId },
    });

    if (!availability) {
      throw new Error('Availability not found');
    }

    if (availability.privateId !== privateId) {
      throw new Error('Invalid Private ID');
    }

    return publicId;
  }

  throw new Error('Improper Private ID length');
}
