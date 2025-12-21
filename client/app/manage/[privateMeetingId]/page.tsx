interface PageProps {
  params: Promise<{
    privateMeetingId: string;
  }>;
}

export default async function ManageMeetingPage({ params }: Readonly<PageProps>) {
  const { privateMeetingId } = await params;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold">Managing Meeting</h1>
      <p className="mt-2 text-gray-600">Private Meeting ID: {privateMeetingId}</p>
    </div>
  );
}
