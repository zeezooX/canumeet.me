import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ManageMeetingContent } from '@/components/manage-meeting/manage-meeting-content';
import { getResponses } from '@/queries';

export interface Props {
  params: Promise<{
    privateMeetingId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { privateMeetingId } = await params;
    const responses = await getResponses(privateMeetingId);

    const title = `Manage Your Meeting - CanUMeetMe`;
    const description = `Manage your meeting on CanUMeetMe. You have ${responses.availabilities.length} responses and ${responses.comments.length} comments.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://canumeetme.com/manage/${privateMeetingId}`,
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

export default async function ManageMeetingPage({ params }: Readonly<Props>) {
  const { privateMeetingId } = await params;

  let responses;
  try {
    responses = await getResponses(privateMeetingId);
  } catch {
    return redirect('/?removeFromPrivateMeetingIds=' + encodeURIComponent(privateMeetingId));
  }

  return <ManageMeetingContent responses={responses} />;
}
