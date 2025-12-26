import { LandingContent } from '@/components/landing/landing-content';
import {
  getMeetings,
  getUserAvailabilityIds,
  getUserMeetingIds,
  getUserPrivateMeetingIds,
} from '@/queries';
import type { GetMeeting } from '@/types';

export default async function Page() {
  let joinedMeetings: GetMeeting[] = [];
  let createdMeetings: GetMeeting[] = [];
  const privateIds: Record<string, string> = {};
  const availabilities: Record<string, string> = {};

  try {
    const meetingIds = await getUserMeetingIds();
    const privateMeetingIds = await getUserPrivateMeetingIds();

    if (meetingIds.length > 0) {
      joinedMeetings = await getMeetings(meetingIds);
    }
    if (privateMeetingIds.length > 0) {
      createdMeetings = await getMeetings(privateMeetingIds.map((id) => id.slice(0, 6)));
    }

    for (const privateMeetingId of privateMeetingIds) {
      const meetingId = privateMeetingId.slice(0, 6);
      privateIds[meetingId] = privateMeetingId;
    }
  } catch {
    // Ignore errors
  }

  try {
    const availabilityIds = await getUserAvailabilityIds();
    for (const availabilityId of availabilityIds) {
      const [meetingId, availId] = availabilityId.split('|');
      availabilities[meetingId] = availId;
    }
  } catch {
    // Ignore errors
  }

  return (
    <LandingContent
      joinedMeetings={joinedMeetings}
      createdMeetings={createdMeetings}
      privateIds={privateIds}
      availabilities={availabilities}
    />
  );
}
