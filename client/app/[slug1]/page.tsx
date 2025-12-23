import { redirect } from 'next/navigation';

export interface Props {
  params: Promise<{
    slug1: string;
  }>;
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
