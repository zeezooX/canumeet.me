import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { EditAvailabilityContent } from '@/components/edit-availability/edit-availability-content';
import { getAvailability, getMeeting } from '@/queries';

export interface Props {
  params: Promise<{
    meetingId: string;
    availabilityId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { meetingId, availabilityId } = await params;
    const meeting = await getMeeting(meetingId);

    const title = `Edit Your Availability - CanUMeetMe`;
    const meetingDisplay = meeting.name ? meeting.name : `${meeting.owner}'s meeting`;
    const description = `Edit your availability for ${meetingDisplay} on CanUMeetMe.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://canumeetme.com/meeting/${meetingId}/availability/${availabilityId}`,
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

export default async function AvailabilityPage({ params }: Readonly<Props>) {
  const { meetingId, availabilityId } = await params;

  let meeting;
  let availability;

  try {
    [meeting, availability] = await Promise.all([
      getMeeting(meetingId),
      getAvailability(meetingId, availabilityId),
    ]);
  } catch {
    return redirect(
      '/?removeFromAvailabilityIds=' + encodeURIComponent(`${meetingId}|${availabilityId}`)
    );
  }

  return <EditAvailabilityContent meeting={meeting} availability={availability} />;
}
