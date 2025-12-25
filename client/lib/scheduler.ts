import { Heap } from 'heap-js';

import { GetAvailability, GetRange } from '@/types';

interface Segment {
  start: number;
  end: number;
  users: Set<string>;
}

interface CandidateSlot {
  start: number;
  end: number;
  score: number;
}

function toMinutes(ts: string): number {
  return Math.floor(new Date(ts).getTime() / 60000);
}

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

function createMaxHeap(): Heap<CandidateSlot> {
  return new Heap<CandidateSlot>((a, b) => b.score - a.score);
}

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
