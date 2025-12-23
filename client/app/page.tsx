import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/logo-full.svg';
import {
  getMeetings,
  getUserAvailabilityIds,
  getUserMeetingIds,
  getUserPrivateMeetingIds,
} from '@/queries';
import { GetMeeting } from '@/types';

export default async function Page() {
  let joinedMeetings: GetMeeting[] = [];
  let createdMeetings: GetMeeting[] = [];
  const privateIds: Record<string, string> = {};
  const availabilities: Record<string, string> = {};

  try {
    const meetingIds = await getUserMeetingIds();
    const privateMeetingIds = await getUserPrivateMeetingIds();
    joinedMeetings = await getMeetings(meetingIds);
    createdMeetings = await getMeetings(privateMeetingIds.map((id) => id.slice(0, 6)));
    for (const privateMeetingId of privateMeetingIds) {
      const meetingId = privateMeetingId.slice(0, 6);
      privateIds[meetingId] = privateMeetingId;
    }
  } catch {
    // Ignore errors
  }

  const availabilityIds = await getUserAvailabilityIds();
  for (const availabilityId of availabilityIds) {
    const [meetingId, availId] = availabilityId.split('|');
    availabilities[meetingId] = availId;
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <Image src={logo} alt="Logo" width={600} height={150} className="block" />
      <h1 className="mt-4 text-3xl font-semibold">Coming Soon</h1>
      <p className="mt-2 text-gray-600">
        We are working hard to bring you a great experience. Stay tuned!
      </p>
      <div className="mt-8 flex flex-col gap-8">
        {joinedMeetings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Joined Meetings</h2>
            <ul className="mt-2 space-y-2">
              {joinedMeetings.map((meeting) => (
                <li key={meeting.publicId}>
                  <Link href={`/meeting/${meeting.publicId}`}>
                    {meeting.name || 'Your Meeting'}
                  </Link>
                  {availabilities[meeting.publicId] && (
                    <>
                      {' | '}
                      <Link
                        href={`/meeting/${meeting.publicId}/availability/${availabilities[meeting.publicId]}`}
                      >
                        Your Availability
                      </Link>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {createdMeetings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Created Meetings</h2>
            <ul className="mt-2 space-y-2">
              {createdMeetings.map((meeting) => (
                <li key={meeting.publicId}>
                  <Link href={`/manage/${privateIds[meeting.publicId]}`}>
                    {meeting.name || 'Your Meeting'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
