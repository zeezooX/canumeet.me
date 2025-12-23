import { Metadata } from 'next';
import { redirect } from 'next/navigation';

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

  let availability;
  try {
    availability = await getAvailability(meetingId, availabilityId);
  } catch {
    return redirect(
      '/?removeFromAvailabilityIds=' + encodeURIComponent(`${meetingId}|${availabilityId}`)
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="mt-6 text-3xl font-semibold">Editing Availability</h1>
      <div className="mt-6 w-full max-w-2xl">
        <dl className="divide-y rounded-md bg-gray-500 shadow-sm">
          {Object.entries(availability).map(([key, val]) => {
            const display =
              val === null
                ? 'null'
                : typeof val === 'object'
                  ? JSON.stringify(val, null, 2)
                  : String(val);
            return (
              <div key={key} className="flex justify-between px-4 py-2">
                <dt className="text-left font-semibold">{key}</dt>
                <dd className="text-left">{display}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
