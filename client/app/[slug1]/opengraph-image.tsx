import ManageImage from '@/app/manage/[privateMeetingId]/opengraph-image';
import MeetingImage from '@/app/meeting/[meetingId]/opengraph-image';
import DefaultImage from '@/app/opengraph-image';

import { Props } from './page';

export const alt = 'CanUMeetMe - Find the perfect meeting time';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: Props) {
  const { slug1 } = await params;

  if (slug1.length === 6) {
    return MeetingImage({ params: Promise.resolve({ meetingId: slug1 }) });
  }
  if (slug1.length === 12) {
    return ManageImage({ params: Promise.resolve({ privateMeetingId: slug1 }) });
  }
  return DefaultImage();
}
