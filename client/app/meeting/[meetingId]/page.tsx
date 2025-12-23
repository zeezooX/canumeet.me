import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getMeeting } from '@/queries';

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
        url: `https://canumeetme.com/m/${meetingId}`,
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

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="mt-6 text-3xl font-semibold">Viewing Meeting</h1>
      <div className="mt-6 w-full max-w-2xl">
        <dl className="divide-y rounded-md bg-gray-500 shadow-sm">
          {Object.entries(meeting).map(([key, val]) => {
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
