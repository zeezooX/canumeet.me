import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/lib';
import { getTheme } from '@/queries';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: '#7A00E6',
};

export const metadata: Metadata = {
  title: 'CanUMeetMe - Schedule Meetings Effortlessly',
  description:
    'Online collaborative tool that facilitates meeting scheduling, without any login or sign-up hassles.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  return (
    <html lang="en" className={cn(inter.variable, 'antialiased', theme)}>
      <body>{children}</body>
    </html>
  );
}
