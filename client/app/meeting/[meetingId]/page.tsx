import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ViewMeetingContent } from '@/components/view-meeting';
import { getMeeting, getUserAvailabilityIds } from '@/queries';

export interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { meetingId } = await params;
    const meeting = await getMeeting(meetingId);

    const title =
      (meeting.name ? `${meeting.name}` : `${meeting.owner}'s Meeting`) + ' - CanUMeetMe';
    const description = `View and respond to ${meeting.owner}'s meeting on CanUMeetMe, no login required.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://canumeetme.com/meeting/${meetingId}`,
      },
      twitter: {
        title,
        description,
      },
    };
  } catch {
    return {};
  }
}

export default async function ViewMeetingPage({ params }: Readonly<Props>) {
  const { meetingId } = await params;

  let meeting;
  try {
    meeting = await getMeeting(meetingId);
  } catch {
    return redirect('/?removeFromMeetingIds=' + encodeURIComponent(meetingId));
  }

  if (meeting.availabilityDeadline && new Date(meeting.availabilityDeadline) < new Date()) {
    meeting.availabilityEnabled = false;
  }

  let availabilityId;
  try {
    const availabilityIds = await getUserAvailabilityIds();
    for (const id of availabilityIds) {
      const [meetingId, availId] = id.split('|');
      if (meetingId === meeting.publicId) availabilityId = availId;
    }
  } catch {
    // Ignore errors
  }

  return <ViewMeetingContent meeting={meeting} availabilityId={availabilityId} />;
}
