interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function ViewMeetingPage({ params }: Readonly<PageProps>) {
  const { meetingId } = await params;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold">Viewing Meeting</h1>
      <p className="mt-2 text-gray-600">Meeting ID: {meetingId}</p>
    </div>
  );
}
