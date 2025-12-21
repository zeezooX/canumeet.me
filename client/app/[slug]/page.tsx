import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 6) {
    redirect(`/m/${slug}`);
  }
  if (slug.length === 12) {
    redirect(`/manage/${slug}`);
  }
  if (slug.length === 16) {
    redirect(`/vote/${slug}`);
  }
  redirect('/');
}
