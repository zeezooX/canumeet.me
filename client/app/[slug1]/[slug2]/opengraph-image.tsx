import AvailabilityImage from '@/app/meeting/[meetingId]/availability/[availabilityId]/opengraph-image';
import DefaultImage from '@/app/opengraph-image';

import { Props } from './page';

export const alt = 'View Meeting - CanUMeetMe';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: Props) {
  const { slug1, slug2 } = await params;

  if (slug1.length === 6 && slug2.length === 16) {
    return AvailabilityImage({
      params: Promise.resolve({ meetingId: slug1, availabilityId: slug2 }),
    });
  }
  return DefaultImage();
}
