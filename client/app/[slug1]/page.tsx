import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { generateMetadata as generateManageMetadata } from '@/app/manage/[privateMeetingId]/page';
import { generateMetadata as generateMeetingMetadata } from '@/app/meeting/[meetingId]/page';

export interface Props {
  params: Promise<{
    slug1: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug1 } = await params;

  if (slug1.length === 6) {
    return generateMeetingMetadata({
      params: Promise.resolve({ meetingId: slug1 }),
    });
  }
  if (slug1.length === 12) {
    return generateManageMetadata({
      params: Promise.resolve({ privateMeetingId: slug1 }),
    });
  }
  return {};
}

export default async function FirstRedirect({ params }: Props) {
  const { slug1 } = await params;

  if (slug1.length === 6) {
    redirect(`/meeting/${slug1}`);
  }
  if (slug1.length === 12) {
    redirect(`/manage/${slug1}`);
  }
  redirect('/');
}
