import { ImageResponse } from 'next/og';

import DefaultImage from '@/app/opengraph-image';
import { OgLayout } from '@/components/common/og-layout';
import { getResponses } from '@/queries';

import { Props } from './page';

export const alt = 'Manage Meeting - CanUMeetMe';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: Props) {
  const { privateMeetingId } = await params;

  let responses;
  try {
    responses = await getResponses(privateMeetingId);
  } catch {
    return DefaultImage();
  }

  const availabilitiesCount = responses.availabilities.length;

  const plural = availabilitiesCount === 1 ? '' : 's';

  const subtitle =
    availabilitiesCount === 0
      ? 'No responses yet'
      : `${availabilitiesCount} availability response${plural}`;

  return new ImageResponse(<OgLayout title="Manage Your Meeting" subtitle={subtitle} />, {
    ...size,
  });
}
