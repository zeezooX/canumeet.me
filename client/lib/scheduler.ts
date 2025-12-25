import { Heap } from 'heap-js';

import { GetAvailability, GetRange } from '@/types';

/**
 * Represents a segment of continuous availability.
 */
interface Segment {
  start: number;
  end: number;
  users: Set<string>;
}

/**
 * Represents a candidate time slot with a score.
 */
interface CandidateSlot {
  start: number;
  end: number;
  score: number;
}

/**
 * Converts a timestamp string to the number of minutes since the Unix epoch.
 * @param ts - The timestamp string to convert.
 * @returns The number of minutes since the Unix epoch.
 */
function toMinutes(ts: string): number {
  return Math.floor(new Date(ts).getTime() / 60000);
}

/**
 * Builds segments of continuous availability from the given availabilities.
 * @param availabilities - An array of user availabilities.
 * @returns An array of segments representing continuous availability.
 */
function buildSegments(availabilities: GetAvailability[]): Segment[] {
  const ranges: GetRange[] = [];
  for (const availability of availabilities) {
    for (const range of availability.ranges) {
      ranges.push(range);
    }
  }

  const events: { time: number; user: string; type: 1 | -1 }[] = [];

  for (const range of ranges) {
    const start = toMinutes(range.startTime);
    const end = toMinutes(range.endTime);

    events.push(
      { time: start, user: range.availabilityId, type: 1 },
      { time: end, user: range.availabilityId, type: -1 }
    );
  }

  events.sort((a, b) => a.time - b.time || b.type - a.type);

  const active = new Set<string>();
  const segments: Segment[] = [];

  for (let i = 0; i < events.length - 1; i++) {
    const event = events[i];
    const next = events[i + 1];

    if (event.type === 1) {
      active.add(event.user);
    } else {
      active.delete(event.user);
    }

    if (active.size > 0 && event.time < next.time) {
      segments.push({
        start: event.time,
        end: next.time,
        users: new Set(active),
      });
    }
  }

  return segments;
}

/**
 * Creates a max-heap for CandidateSlot objects based on their score.
 * @returns A max-heap instance for CandidateSlot objects.
 */
function createMaxHeap(): Heap<CandidateSlot> {
  return new Heap<CandidateSlot>((a, b) => b.score - a.score);
}

/**
 * Runs a sliding window algorithm to find candidate slots based on the provided scoring function.
 * @param availabilities - An array of user availabilities.
 * @param durationMinutes - The duration of the desired time slot in minutes.
 * @param scoreFunc - A function that calculates a score for a given coverage map.
 * @returns A max-heap of candidate slots scored by the provided scoring function.
 */
function runWindow(
  availabilities: GetAvailability[],
  durationMinutes: number,
  scoreFunc: (coverage: Map<string, number>) => number | null
): Heap<CandidateSlot> {
  const segments = buildSegments(availabilities);
  const heap = createMaxHeap();

  let left = 0;
  let windowDuration = 0;
  const coverage = new Map<string, number>();

  for (const rightSeg of segments) {
    windowDuration += rightSeg.end - rightSeg.start;
    for (const user of rightSeg.users) {
      coverage.set(user, (coverage.get(user) || 0) + (rightSeg.end - rightSeg.start));
    }

    while (windowDuration > durationMinutes) {
      const leftSeg = segments[left];
      windowDuration -= leftSeg.end - leftSeg.start;

      for (const user of leftSeg.users) {
        coverage.set(user, coverage.get(user)! - (leftSeg.end - leftSeg.start));
      }
      left++;
    }

    if (windowDuration === durationMinutes) {
      const score = scoreFunc(coverage);
      if (score !== null) {
        heap.push({
          start: segments[left].start,
          end: rightSeg.end,
          score,
        });
      }
    }
  }

  return heap;
}

/**
 * Finds candidate time slots where at least one user is fully available for the specified duration.
 * @param availabilities - An array of user availabilities.
 * @param durationMinutes - The duration of the desired time slot in minutes.
 * @returns A max-heap of candidate slots with the number of fully available users as the score.
 */
export function getStrictCandidates(
  availabilities: GetAvailability[],
  durationMinutes: number
): Heap<CandidateSlot> {
  return runWindow(availabilities, durationMinutes, (coverage) => {
    let attendees = 0;
    for (const time of coverage.values()) {
      if (time >= durationMinutes) {
        attendees++;
      }
    }

    return attendees > 0 ? attendees : null;
  });
}

/**
 * Finds candidate time slots with a scoring based on partial user availability for the specified duration.
 * @param availabilities - An array of user availabilities.
 * @param durationMinutes - The duration of the desired time slot in minutes.
 * @param minFraction - The minimum fraction of the duration that a user must be available to contribute to the score.
 * @returns A max-heap of candidate slots scored by the sum of availability fractions of users.
 */
export function getSoftCandidates(
  availabilities: GetAvailability[],
  durationMinutes: number,
  minFraction: number = 0
): Heap<CandidateSlot> {
  return runWindow(availabilities, durationMinutes, (coverage) => {
    let score = 0;
    for (const time of coverage.values()) {
      const fraction = Math.min(time / durationMinutes, 1);
      score += fraction >= minFraction ? fraction : 0;
    }

    return score > 0 ? score : null;
  });
}
