import Image from 'next/image';

import logo from '@/assets/logo-full.png';

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      <Image src={logo} alt="Logo" width={600} height={150} className="block" />
      <h1 className="mt-4 text-3xl font-semibold">Coming Soon</h1>
      <p className="mt-2 text-gray-600">
        We are working hard to bring you a great experience. Stay tuned!
      </p>
    </div>
  );
}
