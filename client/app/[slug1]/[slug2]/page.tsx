import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { generateMetadata as generateAvailabilityMetadata } from '@/app/meeting/[meetingId]/availability/[availabilityId]/page';

export interface Props {
  params: Promise<{
    slug1: string;
    slug2: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug1, slug2 } = await params;

  if (slug1.length === 6 && slug2.length === 16) {
    return generateAvailabilityMetadata({
      params: Promise.resolve({ meetingId: slug1, availabilityId: slug2 }),
    });
  }
  return {};
}

export default async function SecondRedirect({ params }: Props) {
  const { slug1, slug2 } = await params;

  if (slug1.length === 6 && slug2.length === 16) {
    redirect(`/meeting/${slug1}/availability/${slug2}`);
  }
  redirect('/');
}
