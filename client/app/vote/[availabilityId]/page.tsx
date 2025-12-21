interface PageProps {
  params: Promise<{
    availabilityId: string;
  }>;
}

export default async function VotePage({ params }: Readonly<PageProps>) {
  const { availabilityId } = await params;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold">Voting Page</h1>
      <p className="mt-2 text-gray-600">Availability ID: {availabilityId}</p>
    </div>
  );
}
