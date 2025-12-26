import { ImageResponse } from 'next/og';

import { OgLayout } from '@/components/common/og-layout';

export const alt = 'CanUMeetMe - Find the perfect meeting time';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgLayout title="CanUMeetMe" subtitle="Find the perfect meeting time, no login required" />,
    {
      ...size,
    }
  );
}
