import { NextRequest, NextResponse } from 'next/server';

import { addToList, getValue, removeFromList } from '@/lib';

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const toBeRemoved = [];
  for (const [key, param] of [
    ['meetingIds', 'removeFromMeetingIds'],
    ['privateMeetingIds', 'removeFromPrivateMeetingIds'],
    ['availabilityIds', 'removeFromAvailabilityIds'],
  ] as const) {
    toBeRemoved.push([key, request.nextUrl.searchParams.getAll(param)]);
  }

  const isRemoving = toBeRemoved.some(([, values]) => values.length > 0);
  const response = isRemoving
    ? NextResponse.redirect(new URL('/', request.url))
    : NextResponse.next();

  if (isRemoving) {
    for (const [key, values] of toBeRemoved) {
      for (const value of values) {
        removeFromList(
          key as string,
          value,
          response.cookies,
          getValue<string[]>(key as string, request.cookies)
        );
      }
    }
  }

  const availabilityMatch = /^\/meeting\/([^/]+)\/availability\/([^/]+)/.exec(pathname);
  if (availabilityMatch) {
    addToList(
      'availabilityIds',
      `${availabilityMatch[1]}|${availabilityMatch[2]}`,
      response.cookies,
      getValue<string[]>('availabilityIds', request.cookies)
    );
    return response;
  }

  const meetingMatch = /^\/meeting\/([^/]+)/.exec(pathname);
  if (meetingMatch) {
    addToList(
      'meetingIds',
      meetingMatch[1],
      response.cookies,
      getValue<string[]>('meetingIds', request.cookies)
    );
    return response;
  }

  const manageMatch = /^\/manage\/([^/]+)/.exec(pathname);
  if (manageMatch) {
    addToList(
      'privateMeetingIds',
      manageMatch[1],
      response.cookies,
      getValue<string[]>('privateMeetingIds', request.cookies)
    );
    return response;
  }

  return response;
}
