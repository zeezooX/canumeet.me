import { ImageResponse } from 'next/og';

import DefaultImage from '@/app/opengraph-image';
import { OgLayout } from '@/components/common/og-layout';
import { getMeeting } from '@/queries';

import { Props } from './page';

export const alt = 'Edit Availability - CanUMeetMe';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: Props) {
  const { meetingId } = await params;
  let meeting;
  try {
    meeting = await getMeeting(meetingId);
  } catch {
    return DefaultImage();
  }

  const meetingLabel = meeting.name || meeting.owner + "'s Meeting";
  const subtitle = `Update your availability for ${meetingLabel}`;

  return new ImageResponse(<OgLayout title="Edit Your Availability" subtitle={subtitle} />, {
    ...size,
  });
}
