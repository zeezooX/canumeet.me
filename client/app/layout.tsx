import React from 'react';

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from 'sonner';

import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import ThemeSetter, { ThemeToggle } from '@/components/common/theme-setter';
import { cn } from '@/lib';
import { getTheme } from '@/queries';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: '#7A00E6',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const title = 'CanUMeetMe - Schedule Meetings Effortlessly';
const description =
  'Organize meetings without back-and-forth. CanUMeetMe lets you create meetings, share availability, and find the best time—no registration required.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['canumeetme', 'can u meet me', 'can you meet me', 'meeting scheduler', 'scheduling'],
  robots: 'index',
  openGraph: {
    title,
    description,
    url: 'https://canumeetme.com',
    siteName: 'CanUMeetMe',
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  return (
    <html
      lang="en"
      className={cn(inter.variable, 'scroll-smooth antialiased', theme)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <div className="flex min-h-dvh flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <div className="fixed right-4 bottom-4 z-50">
          <ThemeSetter>
            <ThemeToggle currentTheme={theme} />
          </ThemeSetter>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
