import { redirect } from 'next/navigation';

export interface Props {
  params: Promise<{
    slug1: string;
    slug2: string;
  }>;
}

export default async function SecondRedirect({ params }: Props) {
  const { slug1, slug2 } = await params;

  if (slug1.length === 6 && slug2.length === 16) {
    redirect(`/meeting/${slug1}/availability/${slug2}`);
  }
  redirect('/');
}
